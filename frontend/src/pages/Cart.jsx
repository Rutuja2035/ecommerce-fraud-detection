import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Link to="/products" className="btn-primary mt-6 inline-block">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="text-3xl font-bold">Shopping Cart</h1>
      <div className="mt-8 space-y-4">
        {items.map(({ product, quantity }) => (
          <div key={product.id} className="card flex items-center gap-4">
            <img src={product.image_url} alt={product.name} className="h-20 w-20 rounded-lg object-cover" />
            <div className="flex-1">
              <h3 className="font-semibold">{product.name}</h3>
              <p className="text-sm text-slate-500">${product.price.toFixed(2)} each</p>
            </div>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => updateQuantity(product.id, Number(e.target.value))}
              className="input w-20"
            />
            <p className="w-24 text-right font-semibold">${(product.price * quantity).toFixed(2)}</p>
            <button onClick={() => removeItem(product.id)} className="text-red-500 hover:text-red-700">
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
        <p className="text-xl font-bold">Total: ${total.toFixed(2)}</p>
        <Link to="/checkout" className="btn-primary">
          Proceed to Checkout
        </Link>
      </div>
    </div>
  );
}
