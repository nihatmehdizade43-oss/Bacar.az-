'use client';
/* ================================================
   AlovluElanlar — 🔥 Hot/Featured Listings Section
   ================================================ */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SECTIONS } from '@/lib/pricing';

export default function AlovluElanlar() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/jobs?isAlovlu=true&limit=6')
      .then(r => r.json())
      .then(d => { if (d.success) setJobs(d.data || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (jobs.length === 0) return null;

  return (
    <section className="py-12 px-4">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <span className="text-3xl animate-bounce">🔥</span>
          </div>
          <div>
            <h2 className="text-2xl font-black text-[var(--text-primary)]">
              Alovlu Elanlar
            </h2>
            <p className="text-sm text-[var(--text-muted)]">
              Ən çox diqqət çəkən, ön sıra elanlar
            </p>
          </div>
          <div className="ml-auto hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30">
            <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            <span className="text-xs font-medium text-orange-400">Canlı</span>
          </div>
        </div>

        {/* Fire border strip */}
        <div className="h-1 w-full rounded-full bg-gradient-to-r from-orange-500 via-red-500 to-yellow-500 mb-6" />

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job, i) => {
            const section = SECTIONS[job.section] || SECTIONS.bacar;
            return (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative group rounded-2xl border-2 border-orange-500/30 bg-gradient-to-br from-orange-500/5 to-[var(--bg-card)] p-5 hover:border-orange-500/60 transition-all hover:shadow-lg hover:shadow-orange-500/10"
              >
                {/* Fire badge */}
                <div className="absolute -top-3 -right-2 flex items-center gap-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 px-3 py-1 text-xs font-bold text-white shadow-lg">
                  🔥 ALOVLU
                </div>

                {/* Section badge */}
                <div className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium mb-3"
                  style={{ backgroundColor: `${section.color}15`, color: section.color }}>
                  {section.icon} {section.label.split(' — ')[0]}
                </div>

                <h3 className="font-bold text-[var(--text-primary)] line-clamp-2 group-hover:text-orange-400 transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 line-clamp-2">
                  {job.description}
                </p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-brand-blue">{job.budget} ₼</p>
                    <p className="text-xs text-[var(--text-muted)]">{job.deadlineDays} gün</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[var(--text-muted)]">{job.author?.name}</p>
                    {job.author?.isVip && (
                      <span className="text-xs font-bold text-yellow-400">⭐ VIP</span>
                    )}
                  </div>
                </div>

                <Link href={`/bacar/${job.id}`}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 py-2 text-sm font-bold text-white hover:opacity-90 transition-opacity">
                  Ətraflı Bax →
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
