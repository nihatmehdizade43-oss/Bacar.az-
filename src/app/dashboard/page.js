/* ============================================================
   Bacar.az — İstifadəçi Profil Paneli (Dashboard)
   • Profil məlumatları + redaktə
   • Son elanlar & müraciətlər
   • Vizit portfolio linki
   • Statistika kartları
   ============================================================ */
'use client';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const STATUS_COLORS = {
  pending:  'bg-amber-500/10 text-amber-400 border-amber-500/20',
  approved: 'bg-green-500/10 text-green-400 border-green-500/20',
  rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
};
const STATUS_LABELS = { pending: 'Gözləyir', approved: 'Qəbul edildi', rejected: 'Rədd edildi' };

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [jobs, setJobs]               = useState([]);
  const [applications, setApplications] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading]         = useState(true);
  const [activeTab, setActiveTab]     = useState('overview');

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status !== 'authenticated') return;
    Promise.all([
      fetch('/api/jobs').then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
      fetch('/api/applications').then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
      fetch('/api/notifications').then(r => r.ok ? r.json() : { data: [] }).catch(() => ({ data: [] })),
    ]).then(([j, a, n]) => {
      setJobs(j.data ?? []);
      setApplications(a.data ?? []);
      setNotifications(n.data ?? []);
      setLoading(false);
    });
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-2 border-brand-blue border-t-transparent animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Yüklənir...</p>
        </div>
      </div>
    );
  }

  const user = session?.user;
  const unreadCount = notifications.filter(n => !n.isRead).length;
  const initial = user?.name?.charAt(0)?.toUpperCase() ?? '?';

  const tabs = [
    { id: 'overview',   label: 'İcmal',        icon: '📊' },
    { id: 'jobs',       label: 'Elanlarım',    icon: '💼', count: jobs.length },
    { id: 'applies',    label: 'Müraciətlərim',icon: '📨', count: applications.length },
    { id: 'notifs',     label: 'Bildirişlər',  icon: '🔔', count: unreadCount || undefined },
  ];

  return (
    <div className="min-h-[80vh] py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* ── Profil Header ──────────────────────────────────── */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
          {/* Cover */}
          <div className="h-24 bg-gradient-to-r from-brand-blue via-blue-600 to-brand-green relative">
            <div className="absolute inset-0 opacity-20"
              style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
          </div>

          <div className="px-6 pb-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 -mt-8">
              {/* Avatar */}
              <div className="flex items-end gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-3xl font-black text-white border-4 border-[var(--bg-card)] shadow-xl">
                  {initial}
                </div>
                <div className="pb-1">
                  <h1 className="text-xl font-black text-[var(--text-primary)]">{user?.name}</h1>
                  <p className="text-sm text-[var(--text-muted)]">{user?.email}</p>
                  {user?.profession && (
                    <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold">
                      {user.profession}
                    </span>
                  )}
                </div>
              </div>

              {/* Düymələr */}
              <div className="flex gap-2 flex-wrap">
                <Link href="/mesajlar"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-brand-blue/40 transition-all">
                  💬 Mesajlar
                </Link>
                <Link href="/vizit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-brand-blue/30 bg-brand-blue/5 text-sm font-medium text-brand-blue hover:bg-brand-blue/10 transition-all">
                  ✨ Vizit Portfoliom
                </Link>
                <Link href="/bacar"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-green text-white text-sm font-bold hover:bg-brand-green/90 transition-all shadow-sm shadow-brand-green/20">
                  ➕ Elan ver
                </Link>
              </div>
            </div>

            {/* Activity areas */}
            {user?.activityAreas?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-4">
                {user.activityAreas.slice(0, 6).map(area => (
                  <span key={area} className="px-2 py-0.5 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)] text-xs text-[var(--text-muted)]">
                    {area}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Stat Kartları ──────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Elanlarım',      value: jobs.length,         icon: '💼', color: 'brand-blue'  },
            { label: 'Müraciətlərim',  value: applications.length, icon: '📨', color: 'brand-green' },
            { label: 'Oxunmamış',      value: unreadCount,         icon: '🔔', color: 'amber-500'   },
            { label: 'Hesab növü',     value: user?.role === 'admin' ? 'Admin' : 'Freelancer', icon: '⭐', color: 'purple-500' },
          ].map(stat => (
            <div key={stat.label} className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-4 text-center">
              <span className="text-2xl block mb-1">{stat.icon}</span>
              <p className="text-2xl font-black text-[var(--text-primary)]">{stat.value}</p>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ── Tab ────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-xl p-1 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-blue text-white shadow'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {tab.icon} {tab.label}
              {tab.count > 0 && (
                <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-brand-blue/10 text-brand-blue'}`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* ── Tab Məzmunu ────────────────────────────────────── */}

        {/* İCMAL */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Son elanlar */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--text-primary)]">💼 Son Elanlarım</h2>
                <button onClick={() => setActiveTab('jobs')} className="text-xs text-brand-blue hover:underline">Hamısı</button>
              </div>
              <div className="space-y-2">
                {jobs.slice(0, 3).length ? jobs.slice(0, 3).map(job => (
                  <div key={job.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate flex-1">{job.title}</p>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[job.status] || STATUS_COLORS.pending}`}>
                      {STATUS_LABELS[job.status] || job.status}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <span className="text-3xl block mb-2">📭</span>
                    <p className="text-sm text-[var(--text-muted)]">Hələ elan yoxdur</p>
                    <Link href="/bacar" className="mt-3 inline-block text-xs text-brand-blue hover:underline">
                      İlk elanını ver →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Son müraciətlər */}
            <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-[var(--text-primary)]">📨 Son Müraciətlərim</h2>
                <button onClick={() => setActiveTab('applies')} className="text-xs text-brand-blue hover:underline">Hamısı</button>
              </div>
              <div className="space-y-2">
                {applications.slice(0, 3).length ? applications.slice(0, 3).map(app => (
                  <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <p className="text-sm font-medium text-[var(--text-primary)] truncate flex-1">
                      {app.job?.title ?? 'Elan'}
                    </p>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`}>
                      {STATUS_LABELS[app.status] || 'Gözləyir'}
                    </span>
                  </div>
                )) : (
                  <div className="text-center py-8">
                    <span className="text-3xl block mb-2">🔍</span>
                    <p className="text-sm text-[var(--text-muted)]">Hələ müraciət yoxdur</p>
                    <Link href="/bacar" className="mt-3 inline-block text-xs text-brand-blue hover:underline">
                      İş elanlarına bax →
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Vizit portfolio kartı */}
            <div className="md:col-span-2 rounded-2xl border border-dashed border-brand-blue/30 bg-brand-blue/5 p-6 flex flex-col sm:flex-row items-center gap-5">
              <div className="text-5xl">✨</div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-[var(--text-primary)] mb-1">Vizit — Peşəkar Portfolio</h3>
                <p className="text-sm text-[var(--text-secondary)]">
                  AI dəstəkli portfolio səhifəni yarat. İşəgötürənlər sənin işlərini görsün.
                </p>
              </div>
              <Link href="/vizit"
                className="shrink-0 px-5 py-2.5 rounded-xl bg-brand-blue text-white text-sm font-bold hover:bg-brand-blue/90 transition-all shadow-md shadow-brand-blue/20">
                Portfolio yarat →
              </Link>
            </div>
          </div>
        )}

        {/* ELANLARIM */}
        {activeTab === 'jobs' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[var(--text-primary)]">💼 Elanlarım ({jobs.length})</h2>
              <Link href="/bacar" className="text-xs font-semibold text-white bg-brand-blue px-3 py-1.5 rounded-lg hover:bg-brand-blue/90 transition-colors">
                ➕ Yeni elan
              </Link>
            </div>
            {jobs.length ? (
              <div className="space-y-3">
                {jobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-brand-blue/30 transition-colors">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[var(--text-primary)] truncate">{job.title}</p>
                      <p className="text-xs text-[var(--text-muted)] mt-0.5">{job.category} • {job.budget} ₼</p>
                    </div>
                    <span className={`ml-3 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[job.status] || STATUS_COLORS.pending}`}>
                      {STATUS_LABELS[job.status] || job.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">📭</span>
                <p className="text-[var(--text-secondary)]">Hələ iş elanınız yoxdur</p>
                <Link href="/bacar" className="mt-4 inline-block px-5 py-2 rounded-xl bg-brand-blue text-white text-sm font-semibold hover:bg-brand-blue/90 transition-colors">
                  İlk elanını ver
                </Link>
              </div>
            )}
          </div>
        )}

        {/* MÜRACİƏTLƏRİM */}
        {activeTab === 'applies' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <h2 className="font-bold text-[var(--text-primary)] mb-4">📨 Müraciətlərim ({applications.length})</h2>
            {applications.length ? (
              <div className="space-y-3">
                {applications.map(app => (
                  <div key={app.id} className="p-4 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] hover:border-brand-blue/30 transition-colors">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-semibold text-[var(--text-primary)] flex-1 min-w-0 truncate">
                        {app.job?.title ?? 'Elan'}
                      </p>
                      <span className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_COLORS[app.status] || STATUS_COLORS.pending}`}>
                        {STATUS_LABELS[app.status] || 'Gözləyir'}
                      </span>
                    </div>
                    {app.message && (
                      <p className="text-xs text-[var(--text-muted)] mt-2 line-clamp-2">{app.message}</p>
                    )}
                    <div className="flex gap-3 mt-3">
                      <Link href="/mesajlar" className="text-xs text-brand-blue hover:underline">
                        💬 Söhbətə keç →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">🔍</span>
                <p className="text-[var(--text-secondary)]">Hələ müraciət göndərməmisiniz</p>
                <Link href="/bacar" className="mt-4 inline-block px-5 py-2 rounded-xl bg-brand-blue text-white text-sm font-semibold">
                  İş elanlarına bax
                </Link>
              </div>
            )}
          </div>
        )}

        {/* BİLDİRİŞLƏR */}
        {activeTab === 'notifs' && (
          <div className="bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[var(--text-primary)]">🔔 Bildirişlər ({notifications.length})</h2>
              {unreadCount > 0 && (
                <button
                  onClick={async () => {
                    await fetch('/api/notifications/all-read', { method: 'PUT' });
                    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
                  }}
                  className="text-xs text-brand-blue hover:underline"
                >
                  Hamısını oxunmuş say
                </button>
              )}
            </div>
            {notifications.length ? (
              <div className="space-y-2">
                {notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-xl border transition-colors ${
                      notif.isRead
                        ? 'bg-[var(--bg-primary)] border-[var(--border-color)]'
                        : 'bg-brand-blue/5 border-brand-blue/20'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 shrink-0" />}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[var(--text-primary)]">{notif.title}</p>
                        <p className="text-xs text-[var(--text-muted)] mt-0.5 line-clamp-2">{notif.body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <span className="text-5xl block mb-3">🔕</span>
                <p className="text-[var(--text-secondary)]">Bildiriş yoxdur</p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
