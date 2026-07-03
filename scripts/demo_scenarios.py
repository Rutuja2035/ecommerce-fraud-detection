#!/usr/bin/env python3
"""End-to-end demo scenarios for fraud detection."""

import requests

BASE = "http://127.0.0.1:8000/api"


def login(email: str, password: str) -> str:
    res = requests.post(
        f"{BASE}/auth/login",
        data={"username": email, "password": password},
        timeout=30,
    )
    res.raise_for_status()
    return res.json()["access_token"]


def checkout(token: str, payload: dict):
    res = requests.post(
        f"{BASE}/orders/checkout",
        json=payload,
        headers={"Authorization": f"Bearer {token}"},
        timeout=30,
    )
    print(res.status_code, res.json())


def main():
    products = requests.get(f"{BASE}/products", params={"limit": 3}, timeout=30).json()
    item = {"product_id": products[0]["id"], "quantity": 1}

    print("=== Legitimate customer ===")
    token = login("customer@demo.com", "demo123")
    checkout(
        token,
        {
            "items": [item],
            "shipping_address": "123 Main St, Mumbai, India",
            "billing_address": "123 Main St, Mumbai, India",
            "payment_method": "card",
        },
    )

    print("=== Suspicious transaction ===")
    token = login("suspicious@demo.com", "demo123")
    checkout(
        token,
        {
            "items": [{"product_id": products[1]["id"], "quantity": 5}],
            "shipping_address": "999 Unknown Rd, Lagos, Nigeria",
            "billing_address": "123 Main St, Mumbai, India",
            "payment_method": "wallet",
            "ip_country_mismatch": True,
            "new_device_flag": True,
            "address_mismatch": True,
        },
    )

    print("=== High-risk / blocked pattern ===")
    checkout(
        token,
        {
            "items": [{"product_id": products[2]["id"], "quantity": 10}],
            "shipping_address": "1 Fraud Lane, Unknown",
            "billing_address": "2 Other Place, Elsewhere",
            "payment_method": "card",
            "ip_country_mismatch": True,
            "new_device_flag": True,
            "address_mismatch": True,
        },
    )


if __name__ == "__main__":
    main()
