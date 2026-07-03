import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ordersApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    shipping_address: '123 Main St, Mumbai, India',
    billing_address: '123 Main St, Mumbai, India',
    payment_method: 'card',
    ip_country_mismatch: false,
    new_device_flag: false,
    address_mismatch: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-4 text-center">
        <p>Please login to checkout.</p>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await ordersApi.checkout({
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        ...form,
      });
      clearCart();
      navigate(`/orders/${res.data.id}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Checkout failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 px-4 lg:grid-cols-2">
      <form onSubmit={handleSubmit} className="card space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Checkout</h1>
          <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            Secured by Fraud Shield
          </span>
        </div>
        <div>
          <label className="text-sm font-medium">Shipping Address</label>
          <textarea
            className="input mt-1"
            rows={2}
            value={form.shipping_address}
            onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Billing Address</label>
          <textarea
            className="input mt-1"
            rows={2}
            value={form.billing_address}
            onChange={(e) => setForm({ ...form, billing_address: e.target.value })}
            required
          />
        </div>
        <div>
          <label className="text-sm font-medium">Payment Method</label>
          <select
            className="input mt-1"
            value={form.payment_method}
            onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
          >
            <option value="card">Credit/Debit Card</option>
            <option value="wallet">Digital Wallet</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>

        <details className="rounded-lg border border-amber-200 bg-amber-50 p-4">
          <summary className="cursor-pointer font-medium text-amber-800">Demo fraud signals (for testing)</summary>
          <div className="mt-3 space-y-2 text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.ip_country_mismatch}
                onChange={(e) => setForm({ ...form, ip_country_mismatch: e.target.checked })}
              />
              IP country mismatch
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.new_device_flag}
                onChange={(e) => setForm({ ...form, new_device_flag: e.target.checked })}
              />
              New device detected
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.address_mismatch}
                onChange={(e) => setForm({ ...form, address_mismatch: e.target.checked })}
              />
              Force address mismatch
            </label>
          </div>
        </details>

        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={loading || items.length === 0} className="btn-primary w-full">
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </form>

      <div className="card">
        <h2 className="text-xl font-bold">Order Summary</h2>
        <ul className="mt-4 space-y-2">
          {items.map(({ product, quantity }) => (
            <li key={product.id} className="flex justify-between text-sm">
              <span>
                {product.name} × {quantity}
              </span>
              <span>${(product.price * quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <p className="mt-4 border-t pt-4 text-lg font-bold">Total: ${total.toFixed(2)}</p>
      </div>
    </div>
  );
}
