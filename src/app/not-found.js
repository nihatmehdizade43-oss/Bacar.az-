/* Purpose: Custom 404 page */
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-black text-brand-blue">404</h1>
        <p className="mt-3 text-[var(--text-secondary)]">Axtardığınız səhifə tapılmadı.</p>
        <Link href="/" className="inline-block mt-6 rounded-xl bg-brand-blue px-5 py-3 font-semibold text-white">
          Ana səhifəyə qayıt
        </Link>
      </div>
    </div>
  );
}
