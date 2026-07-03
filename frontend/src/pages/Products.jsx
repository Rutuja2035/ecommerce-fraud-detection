import { useEffect, useState } from 'react';
import { productsApi } from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    productsApi.categories().then((res) => setCategories(res.data));
  }, []);

  useEffect(() => {
    productsApi.list({ category: category || undefined, search: search || undefined, limit: 50 }).then(
      (res) => setProducts(res.data)
    );
  }, [category, search]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <h1 className="text-3xl font-bold">Products</h1>
      <div className="mt-6 flex flex-col gap-4 md:flex-row">
        <input
          className="input max-w-md"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="input max-w-xs" value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
