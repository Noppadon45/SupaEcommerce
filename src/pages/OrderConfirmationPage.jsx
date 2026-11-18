import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { CheckCircle2, Package, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../lib/api';
import { formatDate, formatPrice } from '../lib/format';
import { LoadingGrid, ErrorState } from '../components/States';

export default function OrderConfirmationPage() {
  const { id } = useParams();
  const location = useLocation();
  const { user } = useAuth();
  const [order, setOrder] = useState(location.state?.order || null);
  const [loading, setLoading] = useState(!order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order || !user) return;
    let active = true;
    fetchOrders(user.id)
      .then((orders) => active && setOrder(orders.find((item) => item.id === id) || null))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [id, user, order]);

  if (loading) {
    return <div className="mx-auto max-w-3xl px-4 py-16"><LoadingGrid count={1} /></div>;
  }

  if (error || !order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <ErrorState message={error || 'We could not find that order.'} />
        <div className="mt-6 text-center">
          <Link to="/orders" className="text-sm font-semibold text-brand-600">View my orders</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
      <div className="text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-8 w-8" />
        </span>
        <h1 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-900">Order confirmed!</h1>
        <p className="mt-2 text-slate-500">Thanks for shopping with us. A confirmation has been sent to your email.</p>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Order number</p>
            <p className="mt-1 text-sm font-bold text-slate-900">#{order.id}</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Placed on</p>
            <p className="mt-1 text-sm font-medium text-slate-700">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <div className="divide-y divide-slate-100 px-5">
          {order.items.map((item, index) => (
            <div key={`${item.id}-${index}`} className="flex items-center gap-4 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                <p className="text-xs text-slate-500">Qty {item.quantity}</p>
              </div>
              <p className="text-sm font-bold text-slate-900">{formatPrice(item.price * item.quantity)}</p>
            </div>
          ))}
        </div>

        <div className="border-t border-slate-100 bg-slate-50 px-5 py-4">
          <div className="flex justify-between text-lg font-extrabold text-slate-900">
            <span>Total paid</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>
      </div>

      {order.shipping && (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Package className="h-4 w-4 text-brand-600" /> Shipping details</p>
          <p className="mt-3 text-sm leading-relaxed text-slate-600">
            {order.shipping.fullName}<br />
            {order.shipping.address}<br />
            {order.shipping.city}, {order.shipping.postalCode}<br />
            {order.shipping.country}
          </p>
        </div>
      )}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Link to="/shop" className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-brand-600 py-3.5 text-sm font-bold text-white hover:bg-brand-700">
          Continue shopping <ArrowRight className="h-4 w-4" />
        </Link>
        <Link to="/orders" className="flex flex-1 items-center justify-center rounded-xl border border-slate-300 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">
          View all orders
        </Link>
      </div>
    </div>
  );
}
