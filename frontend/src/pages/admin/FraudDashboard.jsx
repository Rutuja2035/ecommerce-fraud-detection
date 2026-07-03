import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { adminApi } from '../../api/client';
import FraudAlertToast from '../../components/FraudAlertToast';
import { useAuth } from '../../context/AuthContext';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function AdminLogin() {
  const { login, user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@demo.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAdmin) navigate('/admin/fraud');
  }, [isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(email, password);
      if (data.role !== 'admin') {
        setError('Admin access required');
        return;
      }
      navigate('/admin/fraud');
    } catch {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="mx-auto max-w-md px-4">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <h1 className="text-2xl font-bold">Admin Login</h1>
        <p className="text-sm text-slate-500">Demo: admin@demo.com / admin123</p>
        <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input
          className="input"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button className="btn-primary w-full">Login as Admin</button>
        <Link to="/login" className="block text-center text-sm text-brand-600">
          Customer login
        </Link>
      </form>
    </div>
  );
}

function AdminLayout({ children }) {
  const { isAdmin } = useAuth();
  if (!isAdmin) {
    return (
      <div className="px-4 text-center">
        <p>Admin access required.</p>
        <Link to="/admin/login" className="btn-primary mt-4 inline-block">
          Admin Login
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap gap-3 border-b pb-4">
        <Link to="/admin/fraud" className="text-sm font-medium text-brand-600">
          Fraud Dashboard
        </Link>
        <Link to="/admin/orders" className="text-sm font-medium text-slate-600">
          Orders
        </Link>
        <Link to="/admin/ml-metrics" className="text-sm font-medium text-slate-600">
          ML Metrics
        </Link>
        <Link to="/admin/products" className="text-sm font-medium text-slate-600">
          Products
        </Link>
      </div>
      {children}
    </div>
  );
}

export function FraudDashboardPage() {
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState(null);
  const [toast, setToast] = useState(null);

  const load = () => {
    adminApi.fraudEvents().then((res) => setEvents(res.data));
    adminApi.stats().then((res) => setStats(res.data));
  };

  useEffect(() => {
    load();
  }, []);

  const onMessage = useCallback((msg) => {
    if (msg.type === 'fraud_alert') {
      setToast(msg.data);
      setEvents((prev) => [
        {
          id: Date.now(),
          order_id: msg.data.order_id,
          risk_score: msg.data.risk_score,
          decision: msg.data.decision,
          reasons: msg.data.reasons,
          created_at: msg.data.created_at,
        },
        ...prev,
      ]);
    }
  }, []);

  const { connected } = useWebSocket('/api/fraud/ws', onMessage);

  return (
    <AdminLayout>
      <FraudAlertToast alert={toast} onDismiss={() => setToast(null)} />
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Fraud Dashboard</h1>
          <span className={`text-sm ${connected ? 'text-green-600' : 'text-red-500'}`}>
            {connected ? '● Live' : '○ Disconnected'}
          </span>
        </div>

        {stats && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ['Total Orders', stats.total_orders],
              ['Approved', stats.approved],
              ['Flagged', stats.flagged],
              ['Blocked', stats.blocked],
              ['Today', stats.today_orders],
            ].map(([label, value]) => (
              <div key={label} className="card text-center">
                <p className="text-sm text-slate-500">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 overflow-x-auto rounded-xl border bg-white">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-50 text-left">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Score</th>
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">Reasons</th>
                <th className="px-4 py-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {events.map((e) => (
                <tr key={e.id} className="border-t">
                  <td className="px-4 py-3">#{e.order_id}</td>
                  <td className="px-4 py-3">{(e.risk_score * 100).toFixed(1)}%</td>
                  <td className="px-4 py-3 capitalize">{e.decision}</td>
                  <td className="px-4 py-3">{e.reasons}</td>
                  <td className="px-4 py-3">{new Date(e.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
