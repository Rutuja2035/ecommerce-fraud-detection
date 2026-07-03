import json
from datetime import datetime, timedelta
from pathlib import Path

import joblib
import numpy as np
from sqlalchemy.orm import Session

from app.config import settings
from app.ml.features import FEATURE_NAMES, build_feature_vector, build_training_dataframe, explain_reasons
from app.models.order import Order
from app.models.user import User


class FraudService:
    def __init__(self):
        self.model = None
        self.scaler = None
        self.feature_config = None
        self._load_artifacts()

    def _load_artifacts(self):
        if settings.model_path.exists():
            self.model = joblib.load(settings.model_path)
        if settings.scaler_path.exists():
            self.scaler = joblib.load(settings.scaler_path)
        if settings.feature_config_path.exists():
            with open(settings.feature_config_path, encoding="utf-8") as f:
                self.feature_config = json.load(f)

    def _heuristic_score(self, features: dict) -> tuple[float, list[str]]:
        score = 0.05
        reasons = []
        if features["transaction_amount"] > 500:
            score += 0.25
            reasons.append("High transaction amount")
        if features["account_age_days"] < 7:
            score += 0.2
            reasons.append("New account")
        if features["orders_last_24h"] >= 3:
            score += 0.2
            reasons.append("High order velocity")
        if features["address_mismatch"]:
            score += 0.15
            reasons.append("Address mismatch")
        if features["ip_country_mismatch"]:
            score += 0.15
            reasons.append("IP country mismatch")
        if features["new_device_flag"]:
            score += 0.1
            reasons.append("New device detected")
        if features["is_night"]:
            score += 0.05
            reasons.append("Night-time transaction")
        return min(score, 0.99), reasons

    def score_order(
        self,
        db: Session,
        user: User,
        total_amount: float,
        payment_method: str,
        ip_country_mismatch: bool,
        new_device_flag: bool,
        address_mismatch: bool,
    ) -> tuple[float, str, list[str]]:
        now = datetime.utcnow()
        account_age_days = max((now - user.created_at).days, 0)
        since = now - timedelta(hours=24)
        orders_last_24h = (
            db.query(Order)
            .filter(Order.user_id == user.id, Order.created_at >= since)
            .count()
        )
        since_hour = now - timedelta(hours=1)
        transactions_per_hour = (
            db.query(Order)
            .filter(Order.user_id == user.id, Order.created_at >= since_hour)
            .count()
        )

        features = build_feature_vector(
            transaction_amount=total_amount,
            hour_of_day=now.hour,
            account_age_days=account_age_days,
            orders_last_24h=orders_last_24h,
            transactions_per_hour=transactions_per_hour,
            payment_method=payment_method,
            ip_country_mismatch=ip_country_mismatch,
            new_device_flag=new_device_flag,
            address_mismatch=address_mismatch,
        )

        if self.model is not None and self.scaler is not None:
            vector = np.array([[features[name] for name in FEATURE_NAMES]])
            scaled = self.scaler.transform(vector)
            score = float(self.model.predict_proba(scaled)[0][1])
            reasons = explain_reasons(features)
        else:
            score, reasons = self._heuristic_score(features)

        if score >= settings.fraud_block_threshold:
            decision = "blocked"
        elif score >= settings.fraud_flag_threshold:
            decision = "flagged"
        else:
            decision = "approved"

        return score, decision, reasons

    @staticmethod
    def ensure_model_trained(models_dir: Path | None = None):
        from app.ml.train import train_and_save

        target_dir = models_dir or settings.model_path.parent
        target_dir.mkdir(parents=True, exist_ok=True)
        if not settings.model_path.exists():
            train_and_save(output_dir=target_dir)


fraud_service = FraudService()
