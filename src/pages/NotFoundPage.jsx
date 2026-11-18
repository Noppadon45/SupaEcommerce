import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { EmptyState } from '../components/States';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20">
      <p className="text-center text-sm font-bold uppercase tracking-widest text-brand-600">404</p>
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you're looking for doesn't exist or has moved. Let's get you back on track."
        action={
          <Link to="/" className="rounded-xl bg-brand-600 px-6 py-3 text-sm font-semibold text-white hover:bg-brand-700">
            Back to home
          </Link>
        }
      />
    </div>
  );
}
