import { Link } from 'react-router-dom';
import { ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Rating from './Rating';

const badgeStyles = {
  Bestseller: 'bg-brand-600 text-white',
  New: 'bg-emerald-500 text-white',
  Sale: 'bg-amber-500 text-white',
};

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { showToast } = useToast();
  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  function handleAdd(event) {
    event.preventDefault();
    addItem(product);
    showToast(`${product.name} added to cart`);
  }

  return (
    <article className="group flex animate-fade-in flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-card-hover">
      <Link to={`/product/${product.id}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        {product.badge && (
          <span
            className={`absolute left-3 top-3 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${badgeStyles[product.badge] || 'bg-slate-800 text-white'}`}
          >
            {product.badge}
          </span>
        )}
        {discount > 0 && (
          <span className="absolute right-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold text-rose-600 shadow-sm">
            -{discount}%
          </span>
        )}
        <button
          type="button"
          aria-label="Save item"
          onClick={(event) => {
            event.preventDefault();
            showToast('Saved to your wishlist', 'info');
          }}
          className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-slate-400 opacity-0 shadow-sm transition hover:text-rose-500 group-hover:opacity-100 focus:opacity-100"
        >
          <Heart className="h-4 w-4" />
        </button>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-brand-600">
          {product.category}
        </p>
        <Link
          to={`/product/${product.id}`}
          className="mt-1 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition hover:text-brand-600"
        >
          {product.name}
        </Link>
        <div className="mt-2">
          <Rating value={product.rating} reviews={product.reviews} />
        </div>
        <div className="mt-3 flex items-end gap-2">
          <span className="text-lg font-extrabold text-slate-900">{formatPrice(product.price)}</span>
          {product.oldPrice && (
            <span className="pb-0.5 text-sm text-slate-400 line-through">
              {formatPrice(product.oldPrice)}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
        >
          <ShoppingBag className="h-4 w-4" /> Add to cart
        </button>
      </div>
    </article>
  );
}
