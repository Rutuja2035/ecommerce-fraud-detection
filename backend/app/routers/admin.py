import json
from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.dependencies import require_admin
from app.models.fraud_event import FraudEvent
from app.models.order import Order
from app.models.user import User

router = APIRouter(prefix="/api/admin", tags=["admin"])


@router.get("/fraud-events")
def fraud_events(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    events = db.query(FraudEvent).order_by(FraudEvent.created_at.desc()).limit(100).all()
    return [
        {
            "id": e.id,
            "order_id": e.order_id,
            "user_id": e.user_id,
            "risk_score": e.risk_score,
            "decision": e.decision,
            "reasons": e.reasons,
            "created_at": e.created_at.isoformat(),
        }
        for e in events
    ]


@router.get("/stats")
def admin_stats(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    total_orders = db.query(Order).count()
    flagged = db.query(Order).filter(Order.fraud_decision == "flagged").count()
    blocked = db.query(Order).filter(Order.fraud_decision == "blocked").count()
    approved = db.query(Order).filter(Order.fraud_decision == "approved").count()
    today = datetime.utcnow().date()
    today_orders = db.query(Order).filter(Order.created_at >= datetime.combine(today, datetime.min.time())).count()
    return {
        "total_orders": total_orders,
        "approved": approved,
        "flagged": flagged,
        "blocked": blocked,
        "today_orders": today_orders,
    }


@router.get("/ml-metrics")
def ml_metrics(_: User = Depends(require_admin)):
    if settings.metrics_path.exists():
        with open(settings.metrics_path, encoding="utf-8") as f:
            return json.load(f)
    return {"models": {}, "best_model": None, "feature_names": []}
