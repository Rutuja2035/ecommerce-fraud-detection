from pydantic import BaseModel, Field


class ProductCreate(BaseModel):
    name: str
    description: str = ""
    price: float = Field(gt=0)
    category: str
    image_url: str = ""
    stock: int = Field(ge=0, default=100)


class ProductResponse(BaseModel):
    id: int
    name: str
    description: str
    price: float
    category: str
    image_url: str
    stock: int

    model_config = {"from_attributes": True}
