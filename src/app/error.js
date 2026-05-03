/* Purpose: Route-level error boundary UI */
'use client';

export default function Error({ error, reset }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="max-w-lg w-full rounded-2xl border border-red-500/20 bg-red-500/5 p-6">
        <h2 className="text-2xl font-bold text-red-400">Xəta baş verdi</h2>
        <p className="text-sm mt-3 text-[var(--text-secondary)]">{error?.message || 'Gözlənilməz xəta.'}</p>
        <button onClick={reset} className="mt-5 rounded-xl bg-brand-blue px-4 py-2 font-semibold text-white">
          Yenidən cəhd et
        </button>
      </div>
    </div>
  );
}
