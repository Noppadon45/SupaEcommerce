import { Link } from 'react-router-dom';
import { ShoppingCart, Sparkles, Truck, ShieldCheck } from 'lucide-react';

export default function AuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">
      <div className="mx-auto w-full max-w-md">
        <Link to="/" className="mb-8 inline-flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600 text-white">
            <ShoppingCart className="h-5 w-5" />
          </span>
          <span className="text-lg font-extrabold text-slate-900">ShopWave</span>
        </Link>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
        <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>
      </div>

      <div className="relative hidden overflow-hidden rounded-3xl bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-900 p-10 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
            <Sparkles className="h-3.5 w-3.5" /> Join 50,000+ happy shoppers
          </span>
          <h2 className="mt-6 text-4xl font-extrabold leading-tight text-white">
            The good stuff, <span className="text-amber-300">just for you.</span>
          </h2>
          <p className="mt-4 max-w-sm text-indigo-100">
            Save your favorites, track orders, and get first access to new drops and members-only deals.
          </p>
        </div>
        <div className="relative grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur">
            <Truck className="h-5 w-5 text-amber-300" />
            <p className="mt-3 text-sm font-semibold text-white">Free shipping</p>
            <p className="text-xs text-indigo-200">On orders over $75</p>
          </div>
          <div className="rounded-2xl bg-white/10 p-4 ring-1 ring-white/20 backdrop-blur">
            <ShieldCheck className="h-5 w-5 text-amber-300" />
            <p className="mt-3 text-sm font-semibold text-white">Member perks</p>
            <p className="text-xs text-indigo-200">Deals just for you</p>
          </div>
        </div>
      </div>
    </div>
  );
}
