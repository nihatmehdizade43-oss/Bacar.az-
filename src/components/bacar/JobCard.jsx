/* ============================================================
   Bacar.az — JobCard
   • Kateqoriya ikonası categories.js-dən
   • "Müraciət et" düyməsi birbaşa kartda
   • onApply callback ilə ApplyModal açılır
   ============================================================ */
'use client';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { formatBudget, formatDate } from '@/lib/utils';
import { getCategoryIcon, getCategoryLabel } from '@/data/categories';

const catColorMap = {
  proqramlasdirma: 'blue',
  dizayn: 'blue',
  muhasibat: 'green',
  marketinq: 'blue',
  tercume: 'gold',
  muellimlik: 'green',
  video: 'green',
  smm: 'blue',
  foto: 'gold',
  yaziliq: 'blue',
  seo: 'green',
};

export default function JobCard({ job, index = 0, onApply }) {
  const catColor = catColorMap[job.category] || 'blue';
  const catIcon  = getCategoryIcon(job.category);
  const catLabel = getCategoryLabel(job.category);

  return (
    <div className="fade-in-up group" style={{ animationDelay: `${Math.min(index * 80, 500)}ms` }}>
      <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 hover-lift hover:shadow-xl hover:border-brand-blue/30 transition-all flex flex-col h-full">

        {/* Üst sıra — kateqoriya + tarix */}
        <div className="flex items-start justify-between mb-3">
          <Badge color={catColor} size="sm">
            {catIcon} {catLabel}
          </Badge>
          <span className="text-xs text-[var(--text-muted)]">{formatDate(job.postedDate)}</span>
        </div>

        {/* Başlıq */}
        <Link href={`/bacar/${job.id}`}>
          <h3 className="text-base font-bold text-[var(--text-primary)] mb-2 line-clamp-2 hover:text-brand-blue transition-colors cursor-pointer">
            {job.title}
          </h3>
        </Link>

        {/* Açıqlama */}
        <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-3 flex-1">
          {job.description.split('\n')[0]}
        </p>

        {/* Skills */}
        {job.skills?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {job.skills.slice(0, 3).map(s => (
              <span key={s} className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[10px] font-medium text-[var(--text-muted)]">
                {s}
              </span>
            ))}
            {job.skills.length > 3 && (
              <span className="px-2 py-0.5 rounded-md bg-[var(--bg-primary)] border border-[var(--border-color)] text-[10px] font-medium text-[var(--text-muted)]">
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Alt sıra — büdcə + müraciət */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-color)]">
          <div>
            <span className="text-sm font-black text-brand-green">
              {formatBudget(job.budgetMin, job.budgetMax)}
            </span>
            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[var(--text-muted)]">
              <span>👤 {job.applicants} müraciət</span>
              <span>•</span>
              <span>📅 {formatDate(job.deadline)}</span>
            </div>
          </div>

          <button
            onClick={e => { e.preventDefault(); onApply?.(job); }}
            className="px-3 py-1.5 rounded-xl bg-brand-blue text-white text-xs font-bold hover:bg-brand-blue/90 active:scale-95 transition-all shadow-sm shadow-brand-blue/20"
          >
            Müraciət et →
          </button>
        </div>
      </div>
    </div>
  );
}