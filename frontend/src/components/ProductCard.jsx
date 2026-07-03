import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  return (
    <div className="card flex flex-col">
      <img
        src={product.image_url}
        alt={product.name}
        className="mb-4 h-44 w-full rounded-lg object-cover"
      />
      <p className="text-xs uppercase tracking-wide text-brand-600">{product.category}</p>
      <h3 className="mt-1 text-lg font-semibold">{product.name}</h3>
      <p className="mt-2 line-clamp-2 flex-1 text-sm text-slate-600">{product.description}</p>
      <div className="mt-4 flex items-center justify-between">
        <span className="text-xl font-bold">${product.price.toFixed(2)}</span>
        <div className="flex gap-2">
          <Link to={`/products/${product.id}`} className="btn-secondary text-sm">
            View
          </Link>
          <button onClick={() => addItem(product)} className="btn-primary text-sm">
            Add
          </button>
        </div>
      </div>
    </div>
  );
}
