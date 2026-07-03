from sqlalchemy.orm import Session

from app.models.order import Order, OrderItem
from app.models.product import Product
from app.models.user import User
from app.schemas.order import CheckoutRequest
from app.services.fraud_service import fraud_service


def create_order(db: Session, user: User, payload: CheckoutRequest) -> Order:
    if not payload.items:
        raise ValueError("Cart is empty")

    total = 0.0
    line_items: list[tuple[Product, int]] = []

    for item in payload.items:
        product = db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise ValueError(f"Product {item.product_id} not found")
        if product.stock < item.quantity:
            raise ValueError(f"Insufficient stock for {product.name}")
        total += product.price * item.quantity
        line_items.append((product, item.quantity))

    address_mismatch = payload.address_mismatch or (
        payload.shipping_address.strip().lower() != payload.billing_address.strip().lower()
    )

    score, decision, reasons = fraud_service.score_order(
        db=db,
        user=user,
        total_amount=total,
        payment_method=payload.payment_method,
        ip_country_mismatch=payload.ip_country_mismatch,
        new_device_flag=payload.new_device_flag,
        address_mismatch=address_mismatch,
    )

    status = "approved"
    if decision == "flagged":
        status = "under_review"
    elif decision == "blocked":
        status = "blocked"

    order = Order(
        user_id=user.id,
        total_amount=total,
        status=status,
        fraud_score=score,
        fraud_decision=decision,
        fraud_reasons=", ".join(reasons),
        shipping_address=payload.shipping_address,
        billing_address=payload.billing_address,
        payment_method=payload.payment_method,
        ip_country_mismatch=payload.ip_country_mismatch,
        new_device_flag=payload.new_device_flag,
        address_mismatch=address_mismatch,
    )
    db.add(order)
    db.flush()

    if decision != "blocked":
        for product, quantity in line_items:
            product.stock -= quantity
            db.add(
                OrderItem(
                    order_id=order.id,
                    product_id=product.id,
                    quantity=quantity,
                    unit_price=product.price,
                )
            )

    db.commit()
    db.refresh(order)
    return order
