import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ordersApi } from '../../api/client';
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
        <Link to="/admin/orders" className="text-sm font-medium text-brand-600">Orders</Link>
        <Link to="/admin/ml-metrics" className="text-sm font-medium text-slate-600">ML Metrics</Link>
        <Link to="/admin/products" className="text-sm font-medium text-slate-600">Products</Link>
      </div>
      {children}
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const load = () => {
    ordersApi.list(filter ? { fraud_decision: filter } : {}).then((res) => setOrders(res.data));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const review = async (id, action) => {
    await ordersApi.review(id, action);
    load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold">Order Management</h1>
        <select className="input mt-4 max-w-xs" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All decisions</option>
          <option value="approved">Approved</option>
          <option value="flagged">Flagged</option>
          <option value="blocked">Blocked</option>
        </select>

        <div className="mt-6 space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="card flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-semibold">Order #{order.id}</p>
                <p className="text-sm text-slate-500">
                  ${order.total_amount.toFixed(2)} — Score {(order.fraud_score * 100).toFixed(1)}%
                </p>
                <p className="text-sm capitalize">Status: {order.status} / {order.fraud_decision}</p>
                {order.fraud_reasons && <p className="text-xs text-slate-500">{order.fraud_reasons}</p>}
              </div>
              {order.fraud_decision === 'flagged' && (
                <div className="flex gap-2">
                  <button onClick={() => review(order.id, 'approve')} className="btn-primary text-sm">
                    Approve
                  </button>
                  <button onClick={() => review(order.id, 'reject')} className="btn-secondary text-sm">
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
