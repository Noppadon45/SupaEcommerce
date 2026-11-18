import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Sparkles,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
} from 'lucide-react';
import { fetchFeaturedProducts } from '../lib/api';
import { mockProducts } from '../lib/products';
import { useToast } from '../context/ToastContext';
import ProductCard from '../components/ProductCard';
import { LoadingGrid } from '../components/States';

const categoryCards = [
  { name: 'Electronics', emoji: '💻', image: '/images/nova-laptop.svg', tint: 'from-indigo-50 to-indigo-100' },
  { name: 'Clothing', emoji: '👕', image: '/images/denim-jacket.svg', tint: 'from-rose-50 to-rose-100' },
  { name: 'Shoes', emoji: '👟', image: '/images/cloudrun-sneakers.svg', tint: 'from-cyan-50 to-cyan-100' },
  { name: 'Accessories', emoji: '👜', image: '/images/tote-bag.svg', tint: 'from-emerald-50 to-emerald-100' },
];

const perks = [
  { icon: Truck, title: 'Free shipping', text: 'On orders over $75' },
  { icon: RotateCcw, title: 'Easy returns', text: '30-day money back' },
  { icon: ShieldCheck, title: 'Secure checkout', text: 'Your data is protected' },
  { icon: Headphones, title: '24/7 support', text: 'We are always here' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    let active = true;
    fetchFeaturedProducts(4)
      .then((data) => active && setProducts(data))
      .catch(() => active && setProducts(mockProducts.slice(0, 4)))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700 via-brand-600 to-indigo-900" />
        <div className="absolute -left-24 -top-32 h-96 w-96 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-40 right-0 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/20">
              <Sparkles className="h-3.5 w-3.5" /> New season, new essentials
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.1] tracking-tight text-white sm:text-5xl lg:text-6xl">
              Everything you need,{' '}
              <span className="text-amber-300">all in one place.</span>
            </h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-indigo-100 sm:text-lg">
              Discover thoughtfully chosen tech, style, and everyday essentials — at prices that
              make sense. Your next favorite thing is a click away.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-brand-700 shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-50"
              >
                Shop now <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/shop?sort=price-asc"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Browse deals
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-indigo-200">
              <span>⭐ 4.8 average rating</span>
              <span>🚚 Free shipping $75+</span>
              <span>↩️ 30-day returns</span>
            </div>
          </div>

          <div className="relative hidden h-[420px] lg:block">
            <div className="absolute left-4 top-10 w-56 -rotate-6 rounded-2xl bg-white p-3 shadow-2xl">
              <img src="/images/aurora-headphones.svg" alt="Headphones" className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-2 text-sm font-semibold text-slate-800">Aurora Headphones</p>
              <p className="text-xs font-bold text-brand-600">$129.00</p>
            </div>
            <div className="absolute right-2 top-0 w-52 rotate-6 rounded-2xl bg-white p-3 shadow-2xl">
              <img src="/images/cloudrun-sneakers.svg" alt="Sneakers" className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-2 text-sm font-semibold text-slate-800">Cloudrun</p>
              <p className="text-xs font-bold text-brand-600">$119.00</p>
            </div>
            <div className="absolute bottom-0 left-1/2 w-60 -translate-x-1/2 rounded-2xl bg-white p-3 shadow-2xl">
              <img src="/images/pulse-smartwatch.svg" alt="Smartwatch" className="aspect-square w-full rounded-xl object-cover" />
              <p className="mt-2 text-sm font-semibold text-slate-800">Pulse Smartwatch</p>
              <p className="text-xs font-bold text-brand-600">$199.00</p>
            </div>
            <span className="absolute right-6 top-1/2 rounded-full bg-amber-300 px-4 py-2 text-xs font-bold text-slate-900 shadow-lg">
              Up to 30% off
            </span>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 px-4 py-8 sm:px-6 lg:grid-cols-4 lg:px-8">
          {perks.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-slate-900">{title}</p>
                <p className="text-xs text-slate-500">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Browse by category</p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Find your thing</h2>
          </div>
          <Link to="/shop" className="hidden items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700 sm:flex">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {categoryCards.map((category) => (
            <Link
              key={category.name}
              to={`/shop?category=${category.name}`}
              className={`group relative flex h-40 items-end overflow-hidden rounded-2xl bg-gradient-to-br ${category.tint} p-5 ring-1 ring-slate-200 transition hover:-translate-y-1 hover:shadow-card-hover`}
            >
              <img
                src={category.image}
                alt=""
                className="absolute -right-6 -top-6 h-32 w-32 rounded-full object-cover opacity-80 transition group-hover:scale-110"
              />
              <div>
                <span className="text-2xl">{category.emoji}</span>
                <p className="mt-1 text-lg font-bold text-slate-900">{category.name}</p>
              </div>
              <ArrowRight className="absolute bottom-5 right-5 h-5 w-5 text-slate-500 transition group-hover:translate-x-1 group-hover:text-brand-600" />
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="bg-slate-50 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Handpicked for you</p>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Featured products</h2>
            </div>
            <Link to="/shop" className="flex items-center gap-1 text-sm font-semibold text-brand-600 hover:text-brand-700">
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="mt-8">
            {loading ? <LoadingGrid count={4} /> : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {products.map((product) => <ProductCard key={product.id} product={product} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 to-brand-800 px-6 py-12 sm:px-12">
          <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/5" />
          <div className="relative max-w-xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-amber-300">Limited time</p>
            <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">Save up to 30% on select essentials</h2>
            <p className="mt-4 text-slate-300">Better prices on the things you already love. Stock is limited, so grab them while they last.</p>
            <Link
              to="/shop?sort=price-asc"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-amber-300 px-6 py-3 text-sm font-bold text-slate-900 transition hover:bg-amber-200"
            >
              Shop the sale <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="border-t border-slate-100 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-14 text-center sm:px-6 lg:px-8">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">Get the good stuff first</h2>
            <p className="mt-2 text-sm text-slate-500">New drops, exclusive deals, and zero spam.</p>
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              if (!email.trim()) return;
              showToast(`Thanks! We'll email ${email.trim()}`);
              setEmail('');
            }}
            className="flex w-full max-w-md gap-2"
          >
            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Your email address"
              className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100"
            />
            <button className="rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white hover:bg-brand-700">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
