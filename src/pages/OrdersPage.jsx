import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, ChevronRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { fetchOrders } from '../lib/api';
import { formatDate, formatPrice } from '../lib/format';
import { EmptyState, LoadingGrid, ErrorState } from '../components/States';

const statusStyles = {
  processing: 'bg-amber-100 text-amber-700',
  shipped: 'bg-blue-100 text-blue-700',
  delivered: 'bg-emerald-100 text-emerald-700',
  cancelled: 'bg-rose-100 text-rose-700',
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchOrders(user.id)
      .then((data) => active && setOrders(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false));
    return () => { active = false; };
  }, [user.id, reload]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <p className="text-sm font-semibold uppercase tracking-wider text-brand-600">Your account</p>
      <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">My orders</h1>
      <p className="mt-2 text-sm text-slate-500">Track and review everything you have purchased.</p>

      <div className="mt-8">
        {loading ? (
          <LoadingGrid count={2} />
        ) : error ? (
          <ErrorState message={error} onRetry={() => setReload((n) => n + 1)} />
        ) : orders.length === 0 ? (
          <EmptyState
            icon={Package}
            title="No orders yet"
            description="When you place an order, it will show up here with all the details."
            action={
              <Link to="/shop" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
                Start shopping
              </Link>
            }
          />
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-slate-50 px-5 py-4">
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-slate-500">
                    <span><span className="font-semibold uppercase tracking-wide">Order</span> <span className="font-semibold text-slate-800">#{order.id}</span></span>
                    <span>Placed {formatDate(order.createdAt)}</span>
                    <span>{formatPrice(order.total)}</span>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[order.status] || 'bg-slate-100 text-slate-600'}`}>
                    {order.status}
                  </span>
                </div>
                <div className="divide-y divide-slate-100">
                  {order.items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 px-5 py-4">
                      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                        {item.image && <img src={item.image} alt="" className="h-full w-full object-cover" />}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold text-slate-800">{item.name}</p>
                        <p className="text-xs text-slate-500">Qty {item.quantity} · {formatPrice(item.price)} each</p>
                      </div>
                      <Link
                        to={`/product/${item.id}`}
                        className="hidden items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 sm:flex"
                      >
                        View item <ChevronRight className="h-3.5 w-3.5" />
                      </Link>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4">
                  <p className="text-sm text-slate-500">
                    Shipping to <span className="font-medium text-slate-800">{order.shipping?.fullName || 'you'}</span>
                    {order.shipping?.city ? `, ${order.shipping.city}` : ''}
                  </p>
                  <Link to={`/order/${order.id}`} state={{ order }} className="text-sm font-semibold text-brand-600 hover:text-brand-700">
                    View details
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
