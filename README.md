# Real-Time E-Commerce Fraud Detection

A full-stack Data Mining project combining a functional e-commerce storefront with real-time ML-based fraud detection at checkout.

## Features

- **Customer storefront**: Home, product catalog, cart, checkout, login/register, help center
- **Real-time fraud scoring**: ML models score every checkout (Logistic Regression, Random Forest, XGBoost)
- **Admin dashboard**: Live WebSocket fraud alerts, order review, ML metrics charts
- **Data mining pipeline**: EDA, feature engineering, SMOTE, model comparison, evaluation metrics

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, SQLAlchemy, SQLite |
| Frontend | React, Vite, Tailwind CSS, Recharts |
| ML | scikit-learn, imbalanced-learn, XGBoost |

## Quick Start

### 1. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m app.ml.train       # Train and save ML model
uvicorn app.main:app --reload
```

Backend runs at http://127.0.0.1:8000

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at http://localhost:5173

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Customer | customer@demo.com | demo123 |
| Admin | admin@demo.com | admin123 |
| Suspicious test user | suspicious@demo.com | demo123 |

## Demo Scenarios

1. **Legitimate purchase** — Login as customer, add small cart, checkout with matching addresses → **Approved**
2. **Suspicious order** — Login as suspicious@demo.com, enable demo fraud signals on checkout → **Flagged** (appears on admin dashboard live)
3. **Blocked payment** — Large quantity + all fraud signals enabled → **Blocked**

Run automated demo (backend must be running):

```bash
pip install requests
python scripts/demo_scenarios.py
```

## Fraud Decision Rules

| Score | Decision |
|---|---|
| < 0.40 | Approve |
| 0.40 – 0.69 | Flag (admin review) |
| ≥ 0.70 | Block |

## Project Structure

```
backend/          FastAPI API + ML pipeline
frontend/         React e-commerce UI
ml/notebooks/     Jupyter notebooks (EDA + training)
docs/             Data mining report
scripts/          Demo test scripts
```

## Viva Talking Points

1. **Problem**: E-commerce fraud causes financial loss; real-time detection minimizes chargebacks.
2. **Dataset**: Synthetic e-commerce transactions engineered from fraud-detection feature patterns (amount, velocity, device, address).
3. **Preprocessing**: StandardScaler + SMOTE for class imbalance (~8% fraud rate).
4. **Models compared**: Logistic Regression (interpretable baseline), Random Forest (non-linear), XGBoost (best F1).
5. **Metrics**: Precision, Recall, F1 (recall prioritized), ROC-AUC, confusion matrix.
6. **Real-time integration**: Feature vector built from live order + user history → model inference at checkout → WebSocket alert to admin.

## API Docs

Once backend is running: http://127.0.0.1:8000/docs
