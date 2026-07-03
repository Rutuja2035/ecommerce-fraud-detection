from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, require_admin
from app.models.fraud_event import FraudEvent
from app.models.order import Order
from app.models.user import User
from app.schemas.order import CheckoutRequest, OrderResponse, OrderReviewRequest
from app.services.order_service import create_order

router = APIRouter(prefix="/api/orders", tags=["orders"])


@router.post("/checkout", response_model=OrderResponse)
def checkout(
    payload: CheckoutRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        order = create_order(db, current_user, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if order.fraud_decision in {"flagged", "blocked"}:
        event = FraudEvent(
            order_id=order.id,
            user_id=current_user.id,
            risk_score=order.fraud_score,
            decision=order.fraud_decision,
            reasons=order.fraud_reasons,
        )
        db.add(event)
        db.commit()
        from app.routers.fraud import schedule_fraud_alert

        schedule_fraud_alert(
            {
                "order_id": order.id,
                "user_email": current_user.email,
                "total_amount": order.total_amount,
                "risk_score": order.fraud_score,
                "decision": order.fraud_decision,
                "reasons": order.fraud_reasons,
                "created_at": datetime.utcnow().isoformat(),
            }
        )

    return order


@router.get("/my", response_model=list[OrderResponse])
def my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )


@router.get("/{order_id}", response_model=OrderResponse)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if current_user.role != "admin" and order.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")
    return order


@router.get("", response_model=list[OrderResponse])
def list_orders(
    fraud_decision: str | None = None,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    query = db.query(Order).order_by(Order.created_at.desc())
    if fraud_decision:
        query = query.filter(Order.fraud_decision == fraud_decision)
    return query.all()


@router.patch("/{order_id}/review", response_model=OrderResponse)
def review_order(
    order_id: int,
    payload: OrderReviewRequest,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    if payload.action == "approve":
        order.status = "approved"
        order.fraud_decision = "approved"
    else:
        order.status = "rejected"
        order.fraud_decision = "blocked"
    db.commit()
    db.refresh(order)
    return order
