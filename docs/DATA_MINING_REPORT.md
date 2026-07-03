# Data Mining Report — Real-Time E-Commerce Fraud Detection

## 1. Problem Statement

E-commerce platforms face fraudulent transactions including stolen cards, account takeover, and shipping fraud. This project builds a machine learning pipeline to score transactions in real time and integrate scores into a live checkout flow.

## 2. Dataset

We use a **synthetic e-commerce transaction dataset** (20,000 samples) engineered to mirror patterns from public fraud datasets (IEEE-CIS, ULB Credit Card Fraud):

- **Fraud rate**: ~8% (class imbalance)
- **Features**: transaction amount, hour of day, account age, order velocity, payment method, IP mismatch, new device, address mismatch

Feature mapping from checkout to model:

| Checkout Signal | ML Feature |
|---|---|
| Order total | log_transaction_amount |
| Checkout time | hour_of_day, is_night |
| User registration date | account_age_days |
| Orders in last 24h | orders_last_24h |
| Orders in last hour | transactions_per_hour |
| Payment method | payment_card, payment_wallet, payment_cod |
| Demo toggles | ip_country_mismatch, new_device_flag, address_mismatch |

## 3. Exploratory Data Analysis

See `ml/notebooks/01_eda.ipynb`:

- Class distribution (imbalanced)
- Amount distribution (fraud skews higher)
- Correlation between velocity features and fraud label
- Night-time and address mismatch rates by class

## 4. Preprocessing

1. **Train/test split**: 80/20 stratified
2. **Scaling**: StandardScaler on all numeric features
3. **Imbalance handling**: SMOTE on training set
4. **Class weights**: balanced / balanced_subsample for tree models

## 5. Algorithms Compared

| Model | Strength |
|---|---|
| Logistic Regression | Interpretable baseline |
| Random Forest | Captures non-linear interactions |
| XGBoost | Best overall performance |

## 6. Evaluation Metrics

Primary metrics (fraud detection prioritizes **recall**):

- **Precision**: Of flagged transactions, how many are actually fraud
- **Recall**: Of all fraud, how many we catch
- **F1 Score**: Harmonic mean (model selection criterion)
- **ROC-AUC**: Overall ranking ability
- **Confusion Matrix**: TP, FP, TN, FN breakdown

Results are saved to `backend/models/metrics.json` after training.

## 7. Threshold Tuning

Production decision thresholds (configurable):

- `< 0.40` → Approve
- `0.40 – 0.69` → Flag for manual review
- `≥ 0.70` → Block payment

## 8. Real-Time Deployment

At checkout:

1. Build feature vector from order + user history
2. Scale features with saved StandardScaler
3. Run `predict_proba` with saved best model
4. Apply threshold rules
5. Persist score on order; broadcast WebSocket alert if flagged/blocked

## 9. Conclusion

The system demonstrates end-to-end data mining: EDA → preprocessing → multi-model comparison → deployment in a real e-commerce application with live admin monitoring.

## 10. Future Work

- Integrate real IEEE-CIS dataset for training
- SHAP values for explainability
- A/B testing threshold policies
- Redis stream for high-throughput scoring
