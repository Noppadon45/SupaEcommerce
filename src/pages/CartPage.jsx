import { Link } from 'react-router-dom';
import { Trash2, ArrowRight, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../lib/format';
import QuantitySelector from '../components/QuantitySelector';
import { EmptyState } from '../components/States';

const SHIPPING_FEE = 9.99;
const FREE_SHIPPING_THRESHOLD = 75;

export default function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart();
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0 ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <EmptyState
          icon={ShoppingCart}
          title="Your cart is empty"
          description="Looks like you haven't added anything yet. Browse the collection and find something you love."
          action={
            <Link to="/shop" className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Start shopping <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Your cart</h1>
      <p className="mt-2 text-sm text-slate-500">{items.length} item{items.length > 1 ? 's' : ''} in your cart</p>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col gap-4 border-b border-slate-100 p-4 sm:flex-row sm:items-center last:border-0">
              <Link to={`/product/${item.id}`} className="h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
              </Link>
              <div className="min-w-0 flex-1">
                <Link to={`/product/${item.id}`} className="text-sm font-semibold text-slate-900 hover:text-brand-600">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm font-bold text-brand-600">{formatPrice(item.price)}</p>
                <p className="mt-1 text-xs text-slate-400">In stock · Ships in 1-2 days</p>
              </div>
              <div className="flex items-center gap-4">
                <QuantitySelector
                  value={item.quantity}
                  max={item.stock || 99}
                  compact
                  onChange={(value) => updateQuantity(item.id, value)}
                />
                <p className="w-20 text-right text-sm font-bold text-slate-900">
                  {formatPrice(item.price * item.quantity)}
                </p>
                <button
                  onClick={() => removeItem(item.id)}
                  className="grid h-9 w-9 place-items-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-500"
                  aria-label={`Remove ${item.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-slate-900">Order summary</h2>
          <div className="mt-5 space-y-3 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Shipping</span>
              <span className={shipping === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-900'}>
                {shipping === 0 ? 'FREE' : formatPrice(shipping)}
              </span>
            </div>
            <div className="flex justify-between border-t border-slate-100 pt-4 text-base font-bold text-slate-900">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>

          {subtotal < FREE_SHIPPING_THRESHOLD && (
            <div className="mt-5 rounded-xl bg-brand-50 p-3 text-xs text-brand-700">
              Add {formatPrice(FREE_SHIPPING_THRESHOLD - subtotal)} more to get free shipping.
            </div>
          )}
          {subtotal >= FREE_SHIPPING_THRESHOLD && (
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-medium text-emerald-700">
              <Truck className="h-4 w-4" /> You unlocked free shipping!
            </div>
          )}

          <Link
            to="/checkout"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700"
          >
            Proceed to checkout <ArrowRight className="h-4 w-4" />
          </Link>
          <Link to="/shop" className="mt-3 block text-center text-sm font-medium text-slate-500 hover:text-brand-600">
            Continue shopping
          </Link>
          <p className="mt-5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4" /> Secure checkout · 30-day returns
          </p>
        </aside>
      </div>
    </div>
  );
}
