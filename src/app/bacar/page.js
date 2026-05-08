/* ============================================================
   Bacar.az — Freelance Feed
   • 50 kateqoriya (top 10 öndə)
   • Büdcə sürgüsü 1₼→2000₼
   • Müraciət → avtomatik söhbət + bildiriş
   ============================================================ */
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { jobs as demoJobs } from '@/data/jobs';
import { freelancers } from '@/data/freelancers';
import JobCard from '@/components/bacar/JobCard';
import JobFilters from '@/components/bacar/JobFilters';
import ApplyModal from '@/components/bacar/ApplyModal';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/bacar/StarRating';
import Button from '@/components/ui/Button';

export default function BacarPage() {
  const { status } = useSession();
  const isAuthed = status === 'authenticated';

  const [filters, setFilters]     = useState({ search: '', category: '', minBudget: 0 });
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedJob, setSelectedJob] = useState(null); // ApplyModal üçün

  /* ── Filtrlənmiş elanlar ──────────────────────────────── */
  const filteredJobs = useMemo(() => {
    return demoJobs.filter(job => {
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase()) &&
          !job.description.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && job.category !== filters.category) return false;
      if (filters.minBudget > 0 && job.budgetMax < filters.minBudget) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-[80vh] py-10 px-4">
      <div className="max-w-7xl mx-auto">

        {/* ── Başlıq ──────────────────────────────────────── */}
        <div className="text-center mb-8 fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-xs font-semibold text-brand-blue mb-3">
            💼 Freelance Bazarı
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-2">
            <span className="gradient-text-blue">Bacar</span> — İş Tap, Müştəri Tap
          </h1>
          <p className="text-[var(--text-secondary)] text-sm">
            50+ sahədə peşəkar freelancerlər və iş elanları
          </p>
        </div>

        {/* ── Tab ─────────────────────────────────────────── */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 gap-1">
            <button
              onClick={() => setActiveTab('jobs')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'jobs'
                  ? 'bg-brand-blue text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              💼 İş Elanları
              <span className="ml-1.5 text-[10px] opacity-70">({demoJobs.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('freelancers')}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'freelancers'
                  ? 'bg-brand-green text-white shadow-md'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              👨‍💻 Freelancerlər
              <span className="ml-1.5 text-[10px] opacity-70">({freelancers.length})</span>
            </button>
          </div>
        </div>

        {/* ── İş Elanları Tab ─────────────────────────────── */}
        {activeTab === 'jobs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <JobFilters filters={filters} onChange={setFilters} />
              <Link href={isAuthed ? '/dashboard' : '/login'}>
                <Button variant="primary" className="w-full" icon="➕">
                  {isAuthed ? 'İş elanı ver' : 'Daxil ol və elan ver'}
                </Button>
              </Link>
            </div>

            {/* Elanlar */}
            <div className="lg:col-span-3">
              {/* Nəticə sayı */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-[var(--text-muted)]">
                  <span className="font-semibold text-[var(--text-primary)]">{filteredJobs.length}</span> elan tapıldı
                  {filters.category && (
                    <button
                      onClick={() => setFilters(f => ({ ...f, category: '' }))}
                      className="ml-2 text-brand-blue hover:underline"
                    >
                      × filtr sil
                    </button>
                  )}
                </p>
                {filteredJobs.length > 0 && (
                  <span className="text-xs text-[var(--text-muted)]">
                    Ən son elanlar üstdə
                  </span>
                )}
              </div>

              {filteredJobs.length === 0 ? (
                <div className="text-center py-20 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl">
                  <span className="text-5xl mb-4 block">🔍</span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Nəticə tapılmadı</h3>
                  <p className="text-[var(--text-secondary)] text-sm mb-4">Filtrləri dəyişdirməyi sınayın</p>
                  <button
                    onClick={() => setFilters({ search: '', category: '', minBudget: 0 })}
                    className="px-4 py-2 rounded-xl bg-brand-blue/10 text-brand-blue text-sm font-medium hover:bg-brand-blue/20 transition-colors"
                  >
                    Filtrləri sıfırla
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {filteredJobs.map((job, i) => (
                    <JobCard
                      key={job.id}
                      job={job}
                      index={i}
                      onApply={j => setSelectedJob(j)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

        ) : (
          /* ── Freelancerlər Tab ──────────────────────────── */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {freelancers.map((fr, i) => (
              <div key={fr.id} className="fade-in-up" style={{ animationDelay: `${i * 80}ms` }}>
                <Link href={`/bacar/profil/${fr.id}`}>
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5 hover-lift hover:shadow-xl hover:border-brand-green/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-lg font-black text-white shrink-0">
                        {fr.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-[var(--text-primary)] truncate">{fr.name}</h3>
                        <p className="text-xs text-[var(--text-secondary)] truncate">{fr.title}</p>
                      </div>
                    </div>
                    <StarRating rating={fr.rating} size="sm" />
                    <div className="flex flex-wrap gap-1 mt-3">
                      {fr.skills.slice(0, 3).map(s => (
                        <Badge key={s} color="blue" size="sm">{s}</Badge>
                      ))}
                      {fr.skills.length > 3 && (
                        <Badge color="gray" size="sm">+{fr.skills.length - 3}</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-[var(--border-color)]">
                      <span className="text-sm font-semibold text-brand-green">{fr.hourlyRate}</span>
                      <span className="text-xs text-[var(--text-muted)]">📍 {fr.location}</span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Apply Modal ─────────────────────────────────── */}
      {selectedJob && (
        <ApplyModal
          isOpen={!!selectedJob}
          onClose={() => setSelectedJob(null)}
          job={selectedJob}
        />
      )}
    </div>
  );
}