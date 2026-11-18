import { Link } from 'react-router-dom';
import { ShoppingCart, Instagram, Twitter, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-4 lg:px-8">
        <div>
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand-600">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <span className="text-lg font-extrabold">ShopWave</span>
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-slate-400">
            Thoughtfully chosen essentials for everyday life. Great products, honest prices,
            delivered with care.
          </p>
          <div className="mt-5 flex gap-3">
            {[Instagram, Twitter, Github].map((Icon, index) => (
              <a
                key={index}
                href="#"
                onClick={(event) => event.preventDefault()}
                className="grid h-9 w-9 place-items-center rounded-lg bg-slate-800 text-slate-400 transition hover:bg-brand-600 hover:text-white"
                aria-label="Social link"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Shop</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {['Electronics', 'Clothing', 'Shoes', 'Accessories'].map((category) => (
              <li key={category}>
                <Link to={`/shop?category=${category}`} className="hover:text-white">
                  {category}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Account</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li><Link to="/login" className="hover:text-white">Log in</Link></li>
            <li><Link to="/signup" className="hover:text-white">Create account</Link></li>
            <li><Link to="/orders" className="hover:text-white">My orders</Link></li>
            <li><Link to="/cart" className="hover:text-white">Shopping cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Support</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            <li>Free shipping over $75</li>
            <li>30-day easy returns</li>
            <li>Secure checkout</li>
            <li>help@shopwave.example</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-800 py-6 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} ShopWave. Built with React, Tailwind CSS & Supabase.
      </div>
    </footer>
  );
}
