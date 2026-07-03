export default function FraudAlertToast({ alert, onDismiss }) {
  if (!alert) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm rounded-xl border border-red-200 bg-red-50 p-4 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-red-800">Fraud Alert</p>
          <p className="mt-1 text-sm text-red-700">
            Order #{alert.order_id} — score {(alert.risk_score * 100).toFixed(1)}%
          </p>
          <p className="text-xs text-red-600">{alert.reasons}</p>
        </div>
        <button onClick={onDismiss} className="text-red-500 hover:text-red-700">
          ×
        </button>
      </div>
    </div>
  );
}
