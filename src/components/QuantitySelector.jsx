import { Minus, Plus } from 'lucide-react';

export default function QuantitySelector({ value, onChange, max = 99, compact = false }) {
  return (
    <div
      className={`inline-flex items-center rounded-xl border border-slate-200 bg-white ${compact ? 'h-9' : 'h-11'}`}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="grid h-full w-9 place-items-center text-slate-500 transition hover:text-brand-600 disabled:opacity-40"
        disabled={value <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span className="min-w-8 text-center text-sm font-semibold text-slate-900">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="grid h-full w-9 place-items-center text-slate-500 transition hover:text-brand-600 disabled:opacity-40"
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
