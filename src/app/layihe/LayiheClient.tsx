"use client";

import { useState } from "react";

const STARTUPS = [
  { name: "GreenBaku", summary: "Sustainable logistics startup idea.", progress: 64 },
  { name: "EduFlow", summary: "AI-powered personalized learning tracks.", progress: 51 },
  { name: "Qapida", summary: "Hyperlocal neighborhood marketplace.", progress: 72 },
];

export default function LayiheClient() {
  const [selected, setSelected] = useState<string | null>(null);
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [activeLike, setActiveLike] = useState<string | null>(null);

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Layihə — Startup vitrini</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {STARTUPS.map((startup) => (
            <article
              key={startup.name}
              onClick={() => setSelected(startup.name)}
              className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 cursor-pointer hover:scale-[1.02] transition-transform"
            >
              <h2 className="font-bold">{startup.name}</h2>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">{startup.summary}</p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLikes((prev) => ({ ...prev, [startup.name]: (prev[startup.name] ?? 0) + 1 }));
                  setActiveLike(startup.name);
                  setTimeout(() => setActiveLike(null), 260);
                }}
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] px-3 py-1 text-sm"
              >
                <span className={`text-red-500 ${activeLike === startup.name ? 'scale-110' : ''}`}>❤</span>
                {(likes[startup.name] ?? 0) + 12}
              </button>
            </article>
          ))}
        </div>
        {selected && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
            <div className="w-full max-w-md rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
              <h3 className="text-xl font-bold">{selected}</h3>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                {STARTUPS.find((s) => s.name === selected)?.summary}
              </p>
              <div className="mt-4">
                <p className="text-sm text-[var(--text-secondary)]">İnvestisiya marağı</p>
                <div className="h-2 rounded-full bg-[var(--border-color)] overflow-hidden mt-2">
                  <div
                    className="h-full bg-gradient-to-r from-brand-blue to-brand-green"
                    style={{ width: `${STARTUPS.find((s) => s.name === selected)?.progress ?? 0}%` }}
                  />
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="mt-5 w-full rounded-xl border border-[var(--border-color)] py-2">
                Bağla
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
