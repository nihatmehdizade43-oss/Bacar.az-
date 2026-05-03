/* ============================================
   Bacar.az — Portfolio Template
   ============================================ */
'use client';

import { motion } from 'framer-motion';
import Badge from '@/components/ui/Badge';

const COLOR_SCHEMES = [
  { primary: '#0066FF', secondary: '#00A3FF', gradient: 'from-blue-600 to-cyan-500' },
  { primary: '#00C853', secondary: '#00E676', gradient: 'from-green-600 to-emerald-500' },
  { primary: '#9333EA', secondary: '#C084FC', gradient: 'from-purple-600 to-violet-500' },
  { primary: '#F43F5E', secondary: '#FB7185', gradient: 'from-rose-600 to-pink-500' },
  { primary: '#F59E0B', secondary: '#FBBF24', gradient: 'from-amber-600 to-yellow-500' },
];

export default function PortfolioTemplate({ data, colorIndex = 0 }) {
  const scheme = COLOR_SCHEMES[colorIndex % COLOR_SCHEMES.length];

  if (!data) return null;

  return (
    <div id="portfolio-content" className="bg-[var(--bg-primary)] rounded-2xl overflow-hidden border border-[var(--border-color)]">
      {/* Header */}
      <div className={`bg-gradient-to-r ${scheme.gradient} p-8 sm:p-12 text-white relative overflow-hidden`}>
        {/* Dekoratif daireler */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="relative z-10">
          {/* Avatar Placeholder */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-3xl font-black mb-4">
            {data.name?.charAt(0)}{data.surname?.charAt(0)}
          </div>

          <h1 className="text-3xl sm:text-4xl font-black mb-1">
            {data.name} {data.surname}
          </h1>

          {data.title && (
            <p className="text-lg text-white/80 font-medium">{data.title}</p>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-6 sm:p-8 space-y-8">
        {/* Bio */}
        {data.bio && (
          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <span>📝</span> Haqqında
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{data.bio}</p>
          </section>
        )}

        {/* Bacarıqlar */}
        {data.skills?.length > 0 && (
          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <span>⚡</span> Bacarıqlar
            </h2>
            <div className="flex flex-wrap gap-2">
              {data.skills.map(skill => (
                <Badge key={skill} color="blue" size="lg">{skill}</Badge>
              ))}
            </div>
          </section>
        )}

        {/* Təcrübə */}
        {data.experience && (
          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <span>💼</span> Təcrübə
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed">{data.experience}</p>
          </section>
        )}

        {/* Əlaqə */}
        {data.email && (
          <section>
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3 flex items-center gap-2">
              <span>📧</span> Əlaqə
            </h2>
            <p className="text-[var(--text-secondary)]">{data.email}</p>
          </section>
        )}

        {/* Footer */}
        <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
          <span className="text-xs text-[var(--text-muted)]">
            BACAR.AZ ilə yaradılıb
          </span>
          <span className="text-xs text-[var(--text-muted)]">
            🎯 Vizit Portfolio
          </span>
        </div>
      </div>
    </div>
  );
}
