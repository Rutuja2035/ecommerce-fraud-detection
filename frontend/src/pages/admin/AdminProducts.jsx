import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../../api/client';
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
        <Link to="/admin/ml-metrics" className="text-sm font-medium text-slate-600">ML Metrics</Link>
        <Link to="/admin/products" className="text-sm font-medium text-brand-600">Products</Link>
      </div>
      {children}
    </div>
  );
}

const emptyProduct = { name: '', description: '', price: 0, category: 'Electronics', image_url: '', stock: 100 };

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(emptyProduct);

  const load = () => productsApi.list({ limit: 100 }).then((res) => setProducts(res.data));

  useEffect(() => {
    load();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    await productsApi.create({ ...form, price: Number(form.price), stock: Number(form.stock) });
    setForm(emptyProduct);
    load();
  };

  const handleDelete = async (id) => {
    await productsApi.remove(id);
    load();
  };

  return (
    <AdminLayout>
      <div className="mx-auto max-w-6xl px-4">
        <h1 className="text-3xl font-bold">Product Management</h1>

        <form onSubmit={handleCreate} className="card mt-6 grid gap-3 md:grid-cols-2">
          <input className="input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input className="input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="input" type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="input" type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
          <input className="input md:col-span-2" placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          <textarea className="input md:col-span-2" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <button className="btn-primary md:col-span-2">Add Product</button>
        </form>

        <div className="mt-8 space-y-3">
          {products.map((p) => (
            <div key={p.id} className="card flex items-center justify-between">
              <div>
                <p className="font-semibold">{p.name}</p>
                <p className="text-sm text-slate-500">${p.price} — {p.category} — Stock: {p.stock}</p>
              </div>
              <button onClick={() => handleDelete(p.id)} className="text-sm text-red-600">
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
