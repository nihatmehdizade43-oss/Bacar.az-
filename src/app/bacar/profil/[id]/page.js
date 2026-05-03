/* Bacar.az — Freelancer Profil Sayfası */
'use client';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { freelancers } from '@/data/freelancers';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import StarRating from '@/components/bacar/StarRating';

export default function FreelancerProfilePage() {
  const { id } = useParams();
  const fr = freelancers.find(f => f.id === id);

  if (!fr) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl mb-4 block">🔍</span>
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Profil tapılmadı</h2>
          <Link href="/bacar"><Button variant="primary">Geri qayıt</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <Link href="/bacar" className="inline-flex items-center gap-1 text-sm text-[var(--text-muted)] hover:text-brand-blue mb-6 transition-colors">← Freelancerlər</Link>

        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-3xl overflow-hidden">
          {/* Hero Header */}
          <div className="bg-gradient-to-r from-brand-blue to-brand-green p-8 sm:p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"/>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-4xl font-black">
                {fr.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-black">{fr.name}</h1>
                <p className="text-white/80 text-lg">{fr.title}</p>
                <div className="flex items-center gap-3 mt-2">
                  <StarRating rating={fr.rating} size="md" />
                  <span className="text-sm text-white/60">({fr.reviewCount} rəy)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 sm:p-8 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: 'Tamamlanmış iş', value: fr.completedJobs, icon: '✅' },
                { label: 'Təcrübə', value: fr.experience, icon: '💼' },
                { label: 'Saat qiyməti', value: fr.hourlyRate, icon: '💰' },
                { label: 'Məkan', value: fr.location, icon: '📍' },
              ].map(s=>(
                <div key={s.label} className="p-4 rounded-xl bg-[var(--bg-primary)] text-center">
                  <span className="text-2xl block mb-1">{s.icon}</span>
                  <div className="text-lg font-bold text-[var(--text-primary)]">{s.value}</div>
                  <div className="text-xs text-[var(--text-muted)]">{s.label}</div>
                </div>
              ))}
            </div>

            {/* Bio */}
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">📝 Haqqında</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">{fr.bio}</p>
            </div>

            {/* Bacarıqlar */}
            <div>
              <h2 className="text-lg font-bold text-[var(--text-primary)] mb-3">⚡ Bacarıqlar</h2>
              <div className="flex flex-wrap gap-2">
                {fr.skills.map(s=><Badge key={s} color="blue" size="lg">{s}</Badge>)}
              </div>
            </div>

            {/* Status & CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4 border-t border-[var(--border-color)]">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${fr.available?'bg-brand-green animate-pulse':'bg-red-500'}`}/>
                <span className="text-sm font-medium text-[var(--text-secondary)]">
                  {fr.available?'Müsaiddir':'Məşğuldur'}
                </span>
              </div>
              <div className="flex gap-3 sm:ml-auto">
                {fr.portfolioId && (
                  <Link href={`/vizit/${fr.portfolioId}`}>
                    <Button variant="outline" size="md" icon="🎯">Portfolio bax</Button>
                  </Link>
                )}
                <Button variant="success" size="md" icon="📩">Əlaqə qur</Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
