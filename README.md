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
## API Docs
Once backend is running: http://127.0.0.1:8000/docs

![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?logo=sqlite)
![Machine Learning](https://img.shields.io/badge/Machine%20Learning-XGBoost-orange)

A full-stack AI-powered e-commerce application that detects fraudulent transactions in real time using Machine Learning.
 Features
- 🔐 JWT Authentication
- 👤 Customer & Admin Roles
- 🛍️ Product Catalog
- 🛒 Shopping Cart
- 💳 Checkout System
- 🤖 Real-Time Fraud Detection
- 📊 Admin Dashboard
- 📈 ML Metrics Dashboard
- ⚡ WebSocket Live Fraud Alerts
- 📄 FastAPI Swagger Documentation

# Future Improvements

- Docker
- Payment Gateway
- Cloud Deployment
- Email Notifications
- Explainable AI
- Mobile Application

eveloped by
**Rutuja Deshmukh**

