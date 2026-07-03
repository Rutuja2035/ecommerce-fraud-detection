import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productsApi } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    productsApi.list({ limit: 6 }).then((res) => setProducts(res.data));
  }, []);

  return (
    <div>
      <section className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-700 px-8 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-widest text-brand-100">Data Mining Project</p>
          <h1 className="mt-2 max-w-2xl text-4xl font-bold">
            Shop smart with real-time fraud protection
          </h1>
          <p className="mt-4 max-w-xl text-brand-100">
            Every checkout is scored by our ML pipeline using transaction patterns, velocity,
            device signals, and address verification.
          </p>
          <div className="mt-6 flex gap-3">
            <Link to="/products" className="rounded-lg bg-white px-5 py-2 font-medium text-brand-700">
              Browse Products
            </Link>
            <Link
              to="/help"
              className="rounded-lg border border-white/40 px-5 py-2 font-medium text-white"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-12 max-w-7xl px-4">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold">Featured Products</h2>
          <Link to="/products" className="text-brand-600 hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>
    </div>
  );
}
