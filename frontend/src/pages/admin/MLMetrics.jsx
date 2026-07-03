import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { adminApi } from '../../api/client';
import { useAuth } from '../../context/AuthContext';

function AdminLayout({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <div className="px-4 text-center">
        <Link to="/admin/login" className="btn-primary mt-4 inline-block">
          Admin Login
        </Link>
      </div>
    );
  }
  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3 border-b pb-4">
        <Link to="/admin/fraud" className="text-sm font-medium text-slate-600">Fraud Dashboard</Link>
        <Link to="/admin/orders" className="text-sm font-medium text-slate-600">Orders</Link>
        <Link to="/admin/ml-metrics" className="text-sm font-medium text-brand-600">ML Metrics</Link>
        <Link to="/admin/products" className="text-sm font-medium text-slate-600">Products</Link>
      </div>
      {children}
    </div>
  );
}

export default function MLMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    adminApi.mlMetrics().then((res) => setMetrics(res.data));
  }, []);

  if (!metrics) return <p className="px-4">Loading metrics...</p>;

  const chartData = Object.entries(metrics.models || {}).map(([name, m]) => ({
    name: name.replace('_', ' '),
    f1: m.f1,
    precision: m.precision,
    recall: m.recall,
    roc_auc: m.roc_auc,
  }));

  const best = metrics.best_model;
  const bestMetrics = metrics.models?.[best];

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold">ML Model Metrics</h1>
        <p className="mt-2 text-slate-600">Best model: <strong>{best}</strong></p>

        <div className="mt-6 h-80 card">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis domain={[0, 1]} />
              <Tooltip />
              <Bar dataKey="f1" fill="#2563eb" name="F1" />
              <Bar dataKey="recall" fill="#16a34a" name="Recall" />
              <Bar dataKey="precision" fill="#ca8a04" name="Precision" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {bestMetrics && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Accuracy', bestMetrics.accuracy],
              ['Precision', bestMetrics.precision],
              ['Recall', bestMetrics.recall],
              ['ROC-AUC', bestMetrics.roc_auc],
            ].map(([label, value]) => (
              <div key={label} className="card text-center">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{(value * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        )}

        {bestMetrics?.confusion_matrix && (
          <div className="card mt-6">
            <h2 className="font-bold">Confusion Matrix ({best})</h2>
            <table className="mt-4 text-sm">
              <tbody>
                {bestMetrics.confusion_matrix.map((row, i) => (
                  <tr key={i}>
                    {row.map((cell, j) => (
                      <td key={j} className="border px-6 py-2 text-center">
                        {cell}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
