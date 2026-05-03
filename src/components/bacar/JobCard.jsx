/* Bacar.az — Job Card */
'use client';
import Link from 'next/link';
import Badge from '@/components/ui/Badge';
import { formatBudget, formatDate, getCategoryIcon } from '@/lib/utils';

const catColors = { 'dizayn': 'blue', 'kod': 'green', 'tərcümə': 'gold', 'marketinq': 'blue', 'video': 'green' };

export default function JobCard({ job, index = 0 }) {
  return (
    <div className="fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
      <Link href={`/bacar/${job.id}`}>
        <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 hover-lift hover:shadow-xl hover:border-brand-blue/30 transition-all cursor-pointer">
          <div className="flex items-start justify-between mb-3">
            <Badge color={catColors[job.category] || 'blue'} size="sm">
              {getCategoryIcon(job.category)} {job.category}
            </Badge>
            <span className="text-xs text-[var(--text-muted)]">{formatDate(job.postedDate)}</span>
          </div>
          <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2 line-clamp-2">{job.title}</h3>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mb-4">{job.description.split('\n')[0]}</p>
          <div className="mb-3">
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-500">DEMO</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-brand-green">{formatBudget(job.budgetMin, job.budgetMax)}</span>
            <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
              <span>👤 {job.applicants} müraciət</span>
              <span>📅 {formatDate(job.deadline)}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}