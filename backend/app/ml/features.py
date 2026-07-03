import math

import numpy as np
import pandas as pd

FEATURE_NAMES = [
    "log_transaction_amount",
    "hour_of_day",
    "is_night",
    "account_age_days",
    "orders_last_24h",
    "transactions_per_hour",
    "payment_card",
    "payment_wallet",
    "payment_cod",
    "ip_country_mismatch",
    "new_device_flag",
    "address_mismatch",
]


def build_feature_vector(
    transaction_amount: float,
    hour_of_day: int,
    account_age_days: int,
    orders_last_24h: int,
    transactions_per_hour: int,
    payment_method: str,
    ip_country_mismatch: bool,
    new_device_flag: bool,
    address_mismatch: bool,
) -> dict[str, float]:
    payment_method = payment_method.lower()
    return {
        "log_transaction_amount": math.log1p(max(transaction_amount, 0)),
        "hour_of_day": float(hour_of_day),
        "is_night": 1.0 if hour_of_day < 6 or hour_of_day >= 22 else 0.0,
        "account_age_days": float(account_age_days),
        "orders_last_24h": float(orders_last_24h),
        "transactions_per_hour": float(transactions_per_hour),
        "payment_card": 1.0 if payment_method == "card" else 0.0,
        "payment_wallet": 1.0 if payment_method == "wallet" else 0.0,
        "payment_cod": 1.0 if payment_method == "cod" else 0.0,
        "ip_country_mismatch": 1.0 if ip_country_mismatch else 0.0,
        "new_device_flag": 1.0 if new_device_flag else 0.0,
        "address_mismatch": 1.0 if address_mismatch else 0.0,
    }


def explain_reasons(features: dict[str, float]) -> list[str]:
    reasons = []
    if features["log_transaction_amount"] > math.log1p(500):
        reasons.append("High transaction amount")
    if features["account_age_days"] < 7:
        reasons.append("New account")
    if features["orders_last_24h"] >= 3:
        reasons.append("High order velocity")
    if features["transactions_per_hour"] >= 2:
        reasons.append("Rapid transaction frequency")
    if features["address_mismatch"]:
        reasons.append("Address mismatch")
    if features["ip_country_mismatch"]:
        reasons.append("IP country mismatch")
    if features["new_device_flag"]:
        reasons.append("New device detected")
    if features["is_night"]:
        reasons.append("Night-time transaction")
    return reasons or ["Standard risk profile"]


def generate_synthetic_dataset(n_samples: int = 20000, random_state: int = 42) -> pd.DataFrame:
    rng = np.random.default_rng(random_state)
    rows = []
    for _ in range(n_samples):
        is_fraud = rng.random() < 0.08
        amount = float(rng.lognormal(4.0 if not is_fraud else 5.5, 0.6))
        hour = int(rng.integers(0, 24))
        account_age = int(rng.integers(0, 730 if not is_fraud else 14))
        orders_24h = int(rng.poisson(0.4 if not is_fraud else 2.5))
        tx_per_hour = int(rng.poisson(0.2 if not is_fraud else 1.8))
        payment = rng.choice(["card", "wallet", "cod"], p=[0.7, 0.2, 0.1])
        ip_mismatch = bool(rng.random() < (0.03 if not is_fraud else 0.55))
        new_device = bool(rng.random() < (0.08 if not is_fraud else 0.45))
        address_mismatch = bool(rng.random() < (0.04 if not is_fraud else 0.5))

        features = build_feature_vector(
            transaction_amount=amount,
            hour_of_day=hour,
            account_age_days=account_age,
            orders_last_24h=orders_24h,
            transactions_per_hour=tx_per_hour,
            payment_method=payment,
            ip_country_mismatch=ip_mismatch,
            new_device_flag=new_device,
            address_mismatch=address_mismatch,
        )
        features["is_fraud"] = int(is_fraud)
        rows.append(features)

    return pd.DataFrame(rows)


def build_training_dataframe(n_samples: int = 20000) -> pd.DataFrame:
    return generate_synthetic_dataset(n_samples=n_samples)
