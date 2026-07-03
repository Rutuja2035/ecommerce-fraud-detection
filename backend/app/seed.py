from sqlalchemy.orm import Session

from app.database import SessionLocal
from app.models.product import Product
from app.models.user import User
from app.services.auth_service import hash_password

PRODUCTS = [
    ("Wireless Headphones", "Premium noise-cancelling headphones", 149.99, "Electronics", "https://picsum.photos/seed/headphones/400/300"),
    ("Smart Watch", "Fitness tracking and notifications", 199.99, "Electronics", "https://picsum.photos/seed/watch/400/300"),
    ("Laptop Stand", "Ergonomic aluminum stand", 49.99, "Electronics", "https://picsum.photos/seed/laptop/400/300"),
    ("USB-C Hub", "7-in-1 multiport adapter", 39.99, "Electronics", "https://picsum.photos/seed/hub/400/300"),
    ("Mechanical Keyboard", "RGB backlit gaming keyboard", 89.99, "Electronics", "https://picsum.photos/seed/keyboard/400/300"),
    ("Running Shoes", "Lightweight breathable sneakers", 79.99, "Clothing", "https://picsum.photos/seed/shoes/400/300"),
    ("Denim Jacket", "Classic blue denim jacket", 69.99, "Clothing", "https://picsum.photos/seed/jacket/400/300"),
    ("Cotton T-Shirt", "Soft organic cotton tee", 24.99, "Clothing", "https://picsum.photos/seed/tshirt/400/300"),
    ("Winter Scarf", "Wool blend warm scarf", 29.99, "Clothing", "https://picsum.photos/seed/scarf/400/300"),
    ("Leather Belt", "Genuine leather belt", 34.99, "Clothing", "https://picsum.photos/seed/belt/400/300"),
    ("Coffee Maker", "Programmable drip coffee maker", 59.99, "Home", "https://picsum.photos/seed/coffee/400/300"),
    ("Air Purifier", "HEPA filter air purifier", 129.99, "Home", "https://picsum.photos/seed/purifier/400/300"),
    ("Desk Lamp", "LED adjustable desk lamp", 34.99, "Home", "https://picsum.photos/seed/lamp/400/300"),
    ("Throw Pillow", "Decorative cotton pillow", 19.99, "Home", "https://picsum.photos/seed/pillow/400/300"),
    ("Cookware Set", "Non-stick 10-piece set", 89.99, "Home", "https://picsum.photos/seed/cookware/400/300"),
    ("Yoga Mat", "Non-slip exercise mat", 29.99, "Sports", "https://picsum.photos/seed/yoga/400/300"),
    ("Dumbbell Set", "Adjustable 20kg set", 99.99, "Sports", "https://picsum.photos/seed/dumbbell/400/300"),
    ("Water Bottle", "Insulated stainless steel", 24.99, "Sports", "https://picsum.photos/seed/bottle/400/300"),
    ("Camping Tent", "4-person waterproof tent", 149.99, "Sports", "https://picsum.photos/seed/tent/400/300"),
    ("Hiking Backpack", "40L trekking backpack", 79.99, "Sports", "https://picsum.photos/seed/backpack/400/300"),
    ("Bluetooth Speaker", "Portable waterproof speaker", 59.99, "Electronics", "https://picsum.photos/seed/speaker/400/300"),
    ("Tablet", "10-inch HD tablet", 249.99, "Electronics", "https://picsum.photos/seed/tablet/400/300"),
    ("Sunglasses", "UV protection polarized", 44.99, "Clothing", "https://picsum.photos/seed/sunglasses/400/300"),
    ("Skincare Set", "Daily care 3-piece set", 54.99, "Beauty", "https://picsum.photos/seed/skincare/400/300"),
    ("Perfume", "Eau de parfum 50ml", 69.99, "Beauty", "https://picsum.photos/seed/perfume/400/300"),
]


def seed_database():
    db: Session = SessionLocal()
    try:
        if not db.query(User).filter(User.email == "customer@demo.com").first():
            db.add(
                User(
                    name="Demo Customer",
                    email="customer@demo.com",
                    hashed_password=hash_password("demo123"),
                    role="customer",
                )
            )
        if not db.query(User).filter(User.email == "admin@demo.com").first():
            db.add(
                User(
                    name="Admin User",
                    email="admin@demo.com",
                    hashed_password=hash_password("admin123"),
                    role="admin",
                )
            )
        if not db.query(User).filter(User.email == "suspicious@demo.com").first():
            db.add(
                User(
                    name="Suspicious User",
                    email="suspicious@demo.com",
                    hashed_password=hash_password("demo123"),
                    role="customer",
                )
            )
        if db.query(Product).count() == 0:
            for name, desc, price, category, image in PRODUCTS:
                db.add(
                    Product(
                        name=name,
                        description=desc,
                        price=price,
                        category=category,
                        image_url=image,
                        stock=100,
                    )
                )
        db.commit()
    finally:
        db.close()
