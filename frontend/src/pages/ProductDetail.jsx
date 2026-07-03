import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { productsApi } from '../api/client';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();

  useEffect(() => {
    productsApi.get(id).then((res) => setProduct(res.data));
  }, [id]);

  if (!product) return <p className="px-4">Loading...</p>;

  return (
    <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-2">
      <img src={product.image_url} alt={product.name} className="rounded-xl object-cover" />
      <div>
        <p className="text-sm uppercase text-brand-600">{product.category}</p>
        <h1 className="mt-2 text-3xl font-bold">{product.name}</h1>
        <p className="mt-4 text-2xl font-bold">${product.price.toFixed(2)}</p>
        <p className="mt-4 text-slate-600">{product.description}</p>
        <p className="mt-2 text-sm text-slate-500">In stock: {product.stock}</p>
        <div className="mt-6 flex items-center gap-4">
          <input
            type="number"
            min={1}
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="input w-24"
          />
          <button onClick={() => addItem(product, qty)} className="btn-primary">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
