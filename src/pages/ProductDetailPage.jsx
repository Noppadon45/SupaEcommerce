import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  Check,
  ChevronRight,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Minus,
  Plus,
} from 'lucide-react';
import { fetchProduct, fetchProducts } from '../lib/api';
import { formatPrice } from '../lib/format';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import Rating from '../components/Rating';
import ProductCard from '../components/ProductCard';
import { ErrorState } from '../components/States';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setQuantity(1);
    fetchProduct(id)
      .then(async (data) => {
        if (!active) return;
        setProduct(data);
        if (data) {
          const items = await fetchProducts({ category: data.category });
          if (active) setRelated(items.filter((item) => item.id !== data.id).slice(0, 4));
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <div className="aspect-square animate-pulse rounded-3xl bg-slate-200" />
          <div className="space-y-5 pt-6">
            <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
            <div className="h-10 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-32 animate-pulse rounded bg-slate-200" />
            <div className="h-24 animate-pulse rounded bg-slate-200" />
            <div className="h-12 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState
          message={error || 'We could not find that product.'}
          onRetry={() => window.location.reload()}
        />
        <div className="mt-6 text-center">
          <Link to="/shop" className="text-sm font-semibold text-brand-600">Back to shop</Link>
        </div>
      </div>
    );
  }

  const discount = product.oldPrice
    ? Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100)
    : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to="/shop" className="hover:text-brand-600">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link to={`/shop?category=${product.category}`} className="hover:text-brand-600">{product.category}</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate font-medium text-slate-700">{product.name}</span>
      </nav>

      <div className="grid gap-10 lg:grid-cols-2">
        <div className="relative overflow-hidden rounded-3xl bg-slate-100">
          <img src={product.image} alt={product.name} className="aspect-square w-full object-cover" />
          {product.badge && (
            <span className="absolute left-5 top-5 rounded-full bg-brand-600 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="absolute right-5 top-5 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-rose-600 shadow-sm">
              Save {discount}%
            </span>
          )}
        </div>

        <div className="animate-fade-in pt-2">
          <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">{product.category}</p>
          <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            {product.name}
          </h1>
          <div className="mt-3"><Rating value={product.rating} reviews={product.reviews} size="lg" /></div>

          <div className="mt-6 flex items-end gap-3">
            <span className="text-4xl font-extrabold text-slate-900">{formatPrice(product.price)}</span>
            {product.oldPrice && (
              <span className="pb-1 text-xl text-slate-400 line-through">{formatPrice(product.oldPrice)}</span>
            )}
          </div>
          <p className="mt-1 text-sm text-slate-500">Inclusive of all taxes</p>

          <p className="mt-6 leading-relaxed text-slate-600">{product.description}</p>

          <div className="mt-7 flex items-center gap-4">
            <span className="text-sm font-semibold text-slate-700">Quantity</span>
            <div className="inline-flex h-11 items-center rounded-xl border border-slate-200">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="grid h-full w-10 place-items-center text-slate-500 hover:text-brand-600 disabled:opacity-40"
                aria-label="Decrease quantity"
              ><Minus className="h-4 w-4" /></button>
              <span className="min-w-8 text-center text-sm font-semibold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                disabled={quantity >= (product.stock || 99)}
                className="grid h-full w-10 place-items-center text-slate-500 hover:text-brand-600 disabled:opacity-40"
                aria-label="Increase quantity"
              ><Plus className="h-4 w-4" /></button>
            </div>
            {product.stock > 0 && product.stock <= 20 && (
              <span className="text-xs font-medium text-amber-600">Only {product.stock} left in stock</span>
            )}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={() => {
                addItem(product, quantity);
                showToast(`${quantity} × ${product.name} added to cart`);
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-brand-200 transition hover:bg-brand-700 hover:shadow-xl"
            >
              <ShoppingBag className="h-5 w-5" /> Add to cart
            </button>
            <Link
              to="/cart"
              className="flex items-center justify-center rounded-xl border border-slate-300 px-6 py-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              View cart
            </Link>
          </div>

          {product.features?.length > 0 && (
            <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-sm font-bold text-slate-900">Highlights</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-slate-600">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" /> {feature}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { icon: Truck, text: 'Free shipping $75+' },
              { icon: RotateCcw, text: '30-day returns' },
              { icon: ShieldCheck, text: 'Secure checkout' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 rounded-xl bg-slate-50 px-3 py-3 text-xs font-medium text-slate-600">
                <Icon className="h-4 w-4 text-brand-600" /> {text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-extrabold text-slate-900">You may also like</h2>
            <Link to={`/shop?category=${product.category}`} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
              See more
            </Link>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item) => <ProductCard key={item.id} product={item} />)}
          </div>
        </section>
      )}

      <Link to="/shop" className="mt-12 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Back to all products
      </Link>
    </div>
  );
}
