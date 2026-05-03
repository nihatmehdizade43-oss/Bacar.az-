/* Bacar.az — StarRating Bileşeni */
'use client';
export default function StarRating({ rating = 0, size = 'md' }) {
  const sizes = { sm: 'text-sm', md: 'text-lg', lg: 'text-2xl' };
  return (
    <div className={`flex items-center gap-0.5 ${sizes[size]}`}>
      {[1,2,3,4,5].map(star => (
        <span key={star} className={star <= Math.round(rating) ? 'star-filled' : 'star-empty'}>★</span>
      ))}
      <span className="ml-1.5 text-sm font-medium text-[var(--text-secondary)]">{rating.toFixed(1)}</span>
    </div>
  );
}
