/* ============================================
   Bacar.az — Module Cards (Landing)
   ============================================ */
'use client';

import Link from 'next/link';
import { modules } from '@/data/modules';

const borderColors = {
  blue: 'hover:border-blue-500/50',
  green: 'hover:border-green-500/50',
  purple: 'hover:border-purple-500/50',
  gold: 'hover:border-yellow-500/50',
  pink: 'hover:border-pink-500/50',
  orange: 'hover:border-orange-500/50',
};

const glowShadows = {
  blue: 'hover:shadow-blue-500/10',
  green: 'hover:shadow-green-500/10',
  purple: 'hover:shadow-purple-500/10',
  gold: 'hover:shadow-yellow-500/10',
  pink: 'hover:shadow-pink-500/10',
  orange: 'hover:shadow-orange-500/10',
};

const iconBgs = {
  blue: 'bg-blue-500/10',
  green: 'bg-green-500/10',
  purple: 'bg-purple-500/10',
  gold: 'bg-yellow-500/10',
  pink: 'bg-pink-500/10',
  orange: 'bg-orange-500/10',
};

export default function ModuleCards() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-14 fade-in-up">
          <h2 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-4">
            Ekosistem Modulları
          </h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Hər bir modul sənin peşəkar inkişafın üçün xüsusi hazırlanıb
          </p>
        </div>

        {/* Kartlar Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module, index) => (
            <div
              key={module.id}
              className="fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {module.active ? (
                <Link href={module.href}>
                  <ActiveModuleCard module={module} />
                </Link>
              ) : (
                <ComingSoonCard module={module} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Aktif Modul Kartı */
function ActiveModuleCard({ module }) {
  return (
    <div
      className={`relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur
        cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        ${borderColors[module.color]} ${glowShadows[module.color]}`}
    >
      {/* Aktif Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-brand-green/10 text-xs font-semibold text-brand-green">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green animate-pulse" />
          Aktiv
        </span>
      </div>

      {/* İkon */}
      <div className={`w-14 h-14 rounded-2xl ${iconBgs[module.color]} flex items-center justify-center text-3xl mb-4`}>
        {module.icon}
      </div>

      {/* Məzmun */}
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
        {module.name}
      </h3>
      <p className="text-sm font-medium text-brand-blue mb-3">{module.subtitle}</p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-4">
        {module.description}
      </p>

      {/* Stats */}
      {module.stats && (
        <div className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span className="w-1 h-1 rounded-full bg-brand-blue" />
          {module.stats}
        </div>
      )}

      {/* Alt Ok */}
      <div className="mt-4 flex items-center gap-1 text-sm font-medium text-brand-blue">
        Kəşf et
        <span>
          →
        </span>
      </div>
    </div>
  );
}

/** Tezliklə (Coming Soon) Kartı */
function ComingSoonCard({ module }) {
  return (
    <div
      className={`relative p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur
        opacity-70 hover:opacity-90 transition-all duration-300 ${borderColors[module.color]}`}
    >
      {/* Tezliklə Badge */}
      <div className="absolute top-4 right-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-xs font-semibold text-yellow-500">
          🔒 Tezliklə
        </span>
      </div>

      {/* İkon */}
      <div className={`w-14 h-14 rounded-2xl ${iconBgs[module.color]} flex items-center justify-center text-3xl mb-4`}>
        {module.icon}
      </div>

      {/* Məzmun */}
      <h3 className="text-xl font-bold text-[var(--text-primary)] mb-1">
        {module.name}
      </h3>
      <p className="text-sm font-medium text-[var(--text-muted)] mb-3">{module.subtitle}</p>
      <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
        {module.description}
      </p>
    </div>
  );
}
