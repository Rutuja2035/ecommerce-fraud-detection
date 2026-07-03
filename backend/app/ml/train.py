import json
from pathlib import Path

import joblib
import numpy as np
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    accuracy_score,
    confusion_matrix,
    f1_score,
    precision_score,
    recall_score,
    roc_auc_score,
)
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from xgboost import XGBClassifier

from app.config import settings
from app.ml.features import FEATURE_NAMES, build_training_dataframe


def train_and_save(output_dir: Path | None = None) -> dict:
    output_dir = output_dir or settings.model_path.parent
    output_dir.mkdir(parents=True, exist_ok=True)

    df = build_training_dataframe()
    X = df[FEATURE_NAMES].values
    y = df["is_fraud"].values

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    smote = SMOTE(random_state=42)
    X_resampled, y_resampled = smote.fit_resample(X_train_scaled, y_train)

    models = {
        "logistic_regression": LogisticRegression(max_iter=1000, class_weight="balanced"),
        "random_forest": RandomForestClassifier(
            n_estimators=200, random_state=42, class_weight="balanced_subsample"
        ),
        "xgboost": XGBClassifier(
            n_estimators=200,
            max_depth=5,
            learning_rate=0.1,
            subsample=0.9,
            colsample_bytree=0.9,
            eval_metric="logloss",
            random_state=42,
        ),
    }

    metrics = {"models": {}, "best_model": None, "feature_names": FEATURE_NAMES}
    best_name = None
    best_f1 = -1.0
    best_model = None

    for name, model in models.items():
        model.fit(X_resampled, y_resampled)
        preds = model.predict(X_test_scaled)
        probas = model.predict_proba(X_test_scaled)[:, 1]
        model_metrics = {
            "accuracy": float(accuracy_score(y_test, preds)),
            "precision": float(precision_score(y_test, preds, zero_division=0)),
            "recall": float(recall_score(y_test, preds, zero_division=0)),
            "f1": float(f1_score(y_test, preds, zero_division=0)),
            "roc_auc": float(roc_auc_score(y_test, probas)),
            "confusion_matrix": confusion_matrix(y_test, preds).tolist(),
        }
        metrics["models"][name] = model_metrics
        if model_metrics["f1"] > best_f1:
            best_f1 = model_metrics["f1"]
            best_name = name
            best_model = model

    metrics["best_model"] = best_name

    joblib.dump(best_model, output_dir / "fraud_model.pkl")
    joblib.dump(scaler, output_dir / "scaler.pkl")
    with open(output_dir / "feature_config.json", "w", encoding="utf-8") as f:
        json.dump({"feature_names": FEATURE_NAMES}, f, indent=2)
    with open(output_dir / "metrics.json", "w", encoding="utf-8") as f:
        json.dump(metrics, f, indent=2)

    return metrics


if __name__ == "__main__":
    result = train_and_save()
    print(json.dumps(result, indent=2))
