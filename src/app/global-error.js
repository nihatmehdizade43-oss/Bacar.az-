/* Purpose: Root-level fatal error boundary */
'use client';

export default function GlobalError({ error, reset }) {
  return (
    <html lang="az">
      <body className="bg-[#0A0A0A] text-white min-h-screen flex items-center justify-center p-4">
        <div className="max-w-xl w-full rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
          <h2 className="text-2xl font-black">Sistem xətası</h2>
          <p className="mt-3 text-sm text-zinc-300">{error?.message || 'Naməlum xəta baş verdi.'}</p>
          <button onClick={reset} className="mt-6 rounded-xl bg-[#0066FF] px-4 py-2 font-semibold">
            Səhifəni yenilə
          </button>
        </div>
      </body>
    </html>
  );
}
