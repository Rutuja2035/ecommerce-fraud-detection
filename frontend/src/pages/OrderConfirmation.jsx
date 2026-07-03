import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ordersApi } from '../api/client';

const statusStyles = {
  approved: 'bg-green-100 text-green-800',
  under_review: 'bg-amber-100 text-amber-800',
  blocked: 'bg-red-100 text-red-800',
  rejected: 'bg-red-100 text-red-800',
};

export default function OrderConfirmation() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    ordersApi.get(id).then((res) => setOrder(res.data));
  }, [id]);

  if (!order) return <p className="px-4">Loading order...</p>;

  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="card text-center">
        <h1 className="text-2xl font-bold">Order #{order.id}</h1>
        <span className={`mt-3 inline-block rounded-full px-3 py-1 text-sm font-semibold ${statusStyles[order.status] || 'bg-slate-100'}`}>
          {order.status.replace('_', ' ').toUpperCase()}
        </span>
        <p className="mt-4 text-slate-600">Total: ${order.total_amount.toFixed(2)}</p>
        <p className="mt-2 text-sm">
          Fraud score: {(order.fraud_score * 100).toFixed(1)}% — Decision: {order.fraud_decision}
        </p>
        {order.fraud_reasons && (
          <p className="mt-2 text-sm text-slate-500">Reasons: {order.fraud_reasons}</p>
        )}
        {order.status === 'blocked' && (
          <p className="mt-4 text-red-600">
            Your payment was blocked due to suspicious activity. Contact support if this is an error.
          </p>
        )}
        {order.status === 'under_review' && (
          <p className="mt-4 text-amber-700">
            Your order is under review. We will notify you once verification is complete.
          </p>
        )}
        <Link to="/products" className="btn-primary mt-6 inline-block">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
