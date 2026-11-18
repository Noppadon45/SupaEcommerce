import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CreditCard, Lock, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../lib/api';
import { formatPrice } from '../lib/format';
import { EmptyState } from '../components/States';

const SHIPPING_FEE = 9.99;
const FREE_SHIPPING_THRESHOLD = 75;

const initialForm = {
  fullName: '',
  email: '',
  address: '',
  city: '',
  postalCode: '',
  country: 'United States',
};

export default function CheckoutPage() {
  const { user, isDemo } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...initialForm, email: user?.email || '' });
  const [payment, setPayment] = useState('card');
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState(null);

  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  const total = subtotal + shipping;

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (items.length === 0) return;
    setPlacing(true);
    setError(null);
    try {
      const order = await createOrder({ user, items, total, shipping: form });
      clearCart();
      navigate(`/order/${order.id}`, { replace: true, state: { order } });
    } catch (err) {
      setError(err.message || 'Could not place your order. Please try again.');
    } finally {
      setPlacing(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <EmptyState
          title="Nothing to check out"
          description="Your cart is empty. Add a few items before placing an order."
          action={
            <Link to="/shop" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Browse products
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Checkout</h1>
      <p className="mt-2 text-sm text-slate-500">Just a few details and your order is on its way.</p>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Shipping information</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Full name" required value={form.fullName} onChange={(v) => update('fullName', v)} placeholder="Jane Doe" />
              <Field label="Email address" required type="email" value={form.email} onChange={(v) => update('email', v)} placeholder="jane@example.com" />
              <Field label="Street address" required value={form.address} onChange={(v) => update('address', v)} placeholder="123 Main St" className="sm:col-span-2" />
              <Field label="City" required value={form.city} onChange={(v) => update('city', v)} placeholder="New York" />
              <Field label="Postal code" required value={form.postalCode} onChange={(v) => update('postalCode', v)} placeholder="10001" />
              <Field label="Country" required value={form.country} onChange={(v) => update('country', v)} className="sm:col-span-2" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="text-lg font-bold text-slate-900">Payment method</h2>
            <div className="mt-5 space-y-3">
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${payment === 'card' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="payment" value="card" checked={payment === 'card'} onChange={() => setPayment('card')} className="accent-brand-600" />
                <CreditCard className="h-5 w-5 text-brand-600" />
                <span className="text-sm font-semibold text-slate-800">Credit or debit card</span>
              </label>
              <label className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 transition ${payment === 'cod' ? 'border-brand-500 bg-brand-50' : 'border-slate-200 hover:border-slate-300'}`}>
                <input type="radio" name="payment" value="cod" checked={payment === 'cod'} onChange={() => setPayment('cod')} className="accent-brand-600" />
                <span className="text-lg">💵</span>
                <span className="text-sm font-semibold text-slate-800">Cash on delivery</span>
              </label>
            </div>
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-xs leading-relaxed text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              {isDemo
                ? 'Demo mode: no payment is collected and no card details are required. Connect Stripe to accept real payments.'
                : 'Payments are not enabled in this build. Your order will be recorded as pending payment.'}
            </p>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-card lg:sticky lg:top-24">
          <h2 className="text-lg font-bold text-slate-900">Your order</h2>
          <div className="mt-5 max-h-64 space-y-4 overflow-y-auto pr-1">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                  <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-slate-900 text-[10px] font-bold text-white">{item.quantity}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
                  <p className="text-xs text-slate-400">{formatPrice(item.price)} each</p>
                </div>
                <p className="text-sm font-semibold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 space-y-3 border-t border-slate-100 pt-5 text-sm">
            <div className="flex justify-between text-slate-600"><span>Subtotal</span><span className="font-semibold text-slate-900">{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between text-slate-600"><span>Shipping</span><span className={shipping === 0 ? 'font-semibold text-emerald-600' : 'font-semibold text-slate-900'}>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
            <div className="flex justify-between border-t border-slate-100 pt-4 text-lg font-extrabold text-slate-900"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>

          {error && (
            <p className="mt-4 flex items-start gap-2 rounded-xl bg-rose-50 p-3 text-xs text-rose-700">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {error}
            </p>
          )}

          <button
            type="submit"
            disabled={placing}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:opacity-60"
          >
            {placing ? (
              <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" /> Placing order...</>
            ) : (
              <><Lock className="h-4 w-4" /> Place order</>
            )}
          </button>
          <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="h-4 w-4" /> Secure & encrypted
          </p>
          <Link to="/cart" className="mt-3 block text-center text-sm font-medium text-slate-500 hover:text-brand-600">
            Back to cart
          </Link>
        </aside>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, type = 'text', placeholder, className = '' }) {
  return (
    <label className={className}>
      <span className="mb-1.5 block text-xs font-semibold text-slate-600">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm outline-none transition focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
      />
    </label>
  );
}
