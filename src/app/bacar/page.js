/* Bacar.az — Freelance Feed (İş Elanları) */
'use client';
import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { jobs as demoJobs } from '@/data/jobs';
import { freelancers } from '@/data/freelancers';
import JobCard from '@/components/bacar/JobCard';
import JobFilters from '@/components/bacar/JobFilters';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/bacar/StarRating';
import Button from '@/components/ui/Button';

export default function BacarPage() {
  const { status } = useSession();
  const isAuthed = status === 'authenticated';
  const [filters, setFilters] = useState({ search: '', category: '', minBudget: 0 });
  const [activeTab, setActiveTab] = useState('jobs');

  const filteredJobs = useMemo(() => {
    return demoJobs.filter(job => {
      if (filters.search && !job.title.toLowerCase().includes(filters.search.toLowerCase())) return false;
      if (filters.category && job.category !== filters.category) return false;
      if (filters.minBudget && job.budgetMax < filters.minBudget) return false;
      return true;
    });
  }, [filters]);

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-10 fade-in-up">
          <h1 className="text-3xl sm:text-4xl font-black text-[var(--text-primary)] mb-3">
            💼 <span className="gradient-text-green">Bacar</span> — Freelance Bazarı
          </h1>
          <p className="text-[var(--text-secondary)]">İş tap, müştəri tap — hər ikisi burada</p>
        </div>

        {/* Tab Switch */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1">
            <button onClick={()=>setActiveTab('jobs')} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab==='jobs'?'bg-brand-blue text-white shadow-lg':'text-[var(--text-secondary)]'}`}>
              💼 İş Elanları
            </button>
            <button onClick={()=>setActiveTab('freelancers')} className={`px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${activeTab==='freelancers'?'bg-brand-green text-white shadow-lg':'text-[var(--text-secondary)]'}`}>
              👨‍💻 Freelancerlər
            </button>
          </div>
        </div>

        {activeTab === 'jobs' ? (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <JobFilters filters={filters} onChange={setFilters} />
              <Link href={isAuthed ? "/dashboard" : "/login"} className="block mt-4">
                <Button variant="primary" className="w-full" icon="➕">{isAuthed ? 'İş elanı ver' : 'Daxil ol və iş elanı ver'}</Button>
              </Link>
            </div>
            {/* Job Grid */}
            <div className="lg:col-span-3">
              {filteredJobs.length === 0 ? (
                <div className="text-center py-20">
                  <span className="text-5xl mb-4 block">🔍</span>
                  <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Nəticə tapılmadı</h3>
                  <p className="text-[var(--text-secondary)]">Filtrləri dəyişdirməyi sınayın</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredJobs.map((job, i) => <JobCard key={job.id} job={job} index={i} />)}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Freelancer Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {freelancers.map((fr, i) => (
              <div key={fr.id} className="fade-in-up" style={{ animationDelay: `${i * 100}ms` }}>
                <Link href={`/bacar/profil/${fr.id}`}>
                  <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-6 hover-lift hover:shadow-xl hover:border-brand-green/30 transition-all cursor-pointer">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-xl font-black text-white">
                        {fr.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[var(--text-primary)]">{fr.name}</h3>
                        <p className="text-sm text-[var(--text-secondary)]">{fr.title}</p>
                      </div>
                    </div>
                    <StarRating rating={fr.rating} size="sm" />
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {fr.skills.slice(0,3).map(s=><Badge key={s} color="blue" size="sm">{s}</Badge>)}
                      {fr.skills.length>3&&<Badge color="gray" size="sm">+{fr.skills.length-3}</Badge>}
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
    </div>
  );
}