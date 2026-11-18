import { Star } from 'lucide-react';

export default function Rating({ value = 0, reviews, size = 'sm' }) {
  const iconSize = size === 'lg' ? 'h-5 w-5' : 'h-3.5 w-3.5';
  const rounded = Math.round(value);
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`${iconSize} ${
              star <= rounded ? 'fill-amber-400 text-amber-400' : 'fill-slate-200 text-slate-200'
            }`}
          />
        ))}
      </div>
      <span className="text-xs font-medium text-slate-600">{value.toFixed(1)}</span>
      {reviews != null && <span className="text-xs text-slate-400">({reviews})</span>}
    </div>
  );
}
