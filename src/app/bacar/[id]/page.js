/* Bacar.az — İş Elanı Detay Sayfası */
'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { jobs } from '@/data/jobs';
import { formatBudget, formatDate, getCategoryIcon } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import ApplyModal from '@/components/bacar/ApplyModal';

const catColors = { 'dizayn': 'blue', 'kod': 'green', 'tərcümə': 'gold', 'marketinq': 'blue', 'video': 'green' };

export default function JobDetailPage() {
  const { id } = useParams();
  const [showApply, setShowApply] = useState(false);
  const job = jobs.find(j => j.id === id);
  const similarJobs = job
    ? jobs.filter(j => j.id !== job.id && j.category === job.category).slice(0, 3)
    : [];

  if (!job) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Elan tapılmadı</h2>
          <Link href="/bacar"><Button variant="primary">Elanlar səhifəsinə qayıt</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Geri */}
        <Link href="/bacar" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-brand-blue mb-6 transition-colors">
          ← Elanlar
        </Link>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[var(--border-color)]">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div>
                <Badge color={catColors[job.category]||'blue'} size="lg">{getCategoryIcon(job.category)} {job.category}</Badge>
                <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mt-3">{job.title}</h1>
                <p className="text-[var(--text-secondary)] mt-1">Elan sahibi: <span className="font-semibold">{job.posterName}</span></p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-brand-green">{formatBudget(job.budgetMin, job.budgetMax)}</div>
                <div className="text-xs text-[var(--text-muted)] mt-1">Büdcə aralığı</div>
              </div>
            </div>

            {/* Meta */}
            <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
              <span>📅 Deadline: <strong>{formatDate(job.deadline)}</strong></span>
              <span>👤 {job.applicants} müraciət</span>
              <span>📌 Yayımlanıb: {formatDate(job.postedDate)}</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-4">📋 Təsvir</h2>
            <div className="text-[var(--text-secondary)] leading-relaxed whitespace-pre-line mb-6">{job.description}</div>

            {/* Tələb olunan bacarıqlar */}
            <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">⚡ Tələb olunan bacarıqlar</h2>
            <div className="flex flex-wrap gap-2 mb-8">
              {job.skills.map(s=><Badge key={s} color="blue" size="lg">{s}</Badge>)}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="success" size="lg" onClick={()=>setShowApply(true)} icon="📩" className="flex-1">Müraciət et</Button>
              <Button variant="outline" size="lg" className="flex-1" icon="💾">Yadda saxla</Button>
            </div>
          </div>
        </motion.div>

        {/* Benzer ilanlar */}
        {similarJobs.length > 0 && (
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.2}} className="mt-10">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-6">🔍 Benzer ilanlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {similarJobs.map((j) => (
                <Link key={j.id} href={`/bacar/${j.id}`}>
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 hover-lift hover:shadow-xl hover:border-brand-blue/30 transition-all cursor-pointer">
                    <div className="flex items-start justify-between mb-2">
                      <Badge color={catColors[j.category]||'blue'} size="sm">{getCategoryIcon(j.category)} {j.category}</Badge>
                      <span className="text-xs text-[var(--text-muted)]">{formatDate(j.postedDate)}</span>
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{j.title}</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-brand-green">{formatBudget(j.budgetMin, j.budgetMax)}</span>
                      <span className="text-xs text-[var(--text-muted)]">👤 {j.applicants}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <ApplyModal isOpen={showApply} onClose={()=>setShowApply(false)} job={job} />
      </div>
    </div>
  );
}