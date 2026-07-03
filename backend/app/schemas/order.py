from pydantic import BaseModel, Field


class OrderItemCreate(BaseModel):
    product_id: int
    quantity: int = Field(ge=1)


class CheckoutRequest(BaseModel):
    items: list[OrderItemCreate]
    shipping_address: str
    billing_address: str
    payment_method: str = "card"
    ip_country_mismatch: bool = False
    new_device_flag: bool = False
    address_mismatch: bool = False


class OrderItemResponse(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

    model_config = {"from_attributes": True}


class OrderResponse(BaseModel):
    id: int
    total_amount: float
    status: str
    fraud_score: float
    fraud_decision: str
    fraud_reasons: str
    shipping_address: str
    billing_address: str
    payment_method: str
    items: list[OrderItemResponse] = []

    model_config = {"from_attributes": True}


class OrderReviewRequest(BaseModel):
    action: str = Field(pattern="^(approve|reject)$")
