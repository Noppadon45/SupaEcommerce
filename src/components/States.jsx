import { PackageOpen, SearchX, AlertCircle } from 'lucide-react';

export function LoadingGrid({ count = 8 }) {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="overflow-hidden rounded-2xl border border-slate-200">
          <div className="aspect-square animate-pulse bg-slate-200" />
          <div className="space-y-3 p-4">
            <div className="h-3 w-16 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-slate-200" />
            <div className="h-4 w-1/3 animate-pulse rounded bg-slate-200" />
            <div className="h-10 animate-pulse rounded-xl bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function EmptyState({
  icon: Icon = PackageOpen,
  title,
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-6 py-16 text-center">
      <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-slate-400 shadow-sm">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <EmptyState
      icon={AlertCircle}
      title="Something went wrong"
      description={message || 'We could not load this content. Please try again.'}
      action={
        onRetry && (
          <button
            onClick={onRetry}
            className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
          >
            Try again
          </button>
        )
      }
    />
  );
}

export function NoResults({ onClear }) {
  return (
    <EmptyState
      icon={SearchX}
      title="No products found"
      description="Try a different search term or clear the filters to see everything."
      action={
        <button
          onClick={onClear}
          className="rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Clear filters
        </button>
      }
    />
  );
}
