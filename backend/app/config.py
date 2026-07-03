from pathlib import Path

from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent
MODELS_DIR = BASE_DIR / "models"


class Settings(BaseSettings):
    app_name: str = "FraudShield E-Commerce"
    secret_key: str = "fraud-shield-dev-secret-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24
    database_url: str = f"sqlite:///{BASE_DIR / 'fraud_ecommerce.db'}"
    cors_origins: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173"]
    fraud_flag_threshold: float = 0.4
    fraud_block_threshold: float = 0.7
    model_path: Path = MODELS_DIR / "fraud_model.pkl"
    scaler_path: Path = MODELS_DIR / "scaler.pkl"
    feature_config_path: Path = MODELS_DIR / "feature_config.json"
    metrics_path: Path = MODELS_DIR / "metrics.json"


settings = Settings()
