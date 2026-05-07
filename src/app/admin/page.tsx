// Purpose: Full admin dashboard — stats, all users, listings, messages, VIP management.
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';

/* ─── Helpers ─── */
function fmt(n) { return n?.toLocaleString('az-AZ') ?? '0'; }
function timeAgo(d) {
  const diff = (Date.now() - new Date(d)) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s əvvəl`;
  if (diff < 3600) return `${Math.floor(diff / 60)}d əvvəl`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}s əvvəl`;
  return new Date(d).toLocaleDateString('az-AZ');
}

/* ─── Stat Card ─── */
function StatCard({ label, value, icon, color = '#0066FF', sub }) {
  return (
    <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-[var(--text-muted)]">{label}</p>
          <p className="mt-1 text-3xl font-black" style={{ color }}>{fmt(value)}</p>
          {sub && <p className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</p>}
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
    </div>
  );
}

/* ─── Tab Button ─── */
function Tab({ active, onClick, children, count }) {
  return (
    <button onClick={onClick}
      className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
        active ? 'bg-brand-blue text-white shadow-lg' : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card)]'
      }`}>
      {children}
      {count !== undefined && (
        <span className={`rounded-full px-1.5 py-0.5 text-xs ${active ? 'bg-white/20' : 'bg-[var(--border-color)]'}`}>
          {count}
        </span>
      )}
    </button>
  );
}

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [userSearch, setUserSearch] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  /* Auth guard */
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
    if (status === 'authenticated' && session?.user?.role !== 'admin') router.push('/');
  }, [status, session, router]);

  /* Fetch all data */
  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes, jobsRes, flagRes] = await Promise.all([
        fetch('/api/admin/stats').then(r => r.json()),
        fetch('/api/admin/users?limit=100').then(r => r.json()),
        fetch('/api/admin/listings?limit=50').then(r => r.json()),
        fetch('/api/admin/flagged').then(r => r.json()),
      ]);
      if (statsRes.data) setStats(statsRes.data);
      if (usersRes.success) setUsers(usersRes.data);
      if (jobsRes.success) setJobs(jobsRes.data);
      if (flagRes.success) setFlagged(flagRes.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { if (status === 'authenticated') fetchAll(); }, [status, fetchAll]);

  /* User action */
  async function userAction(userId, action) {
    setActionMsg('');
    const res = await fetch('/api/admin/users', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, action }),
    });
    const json = await res.json();
    if (json.success) {
      setActionMsg(`✅ Əməliyyat tamamlandı`);
      fetchAll();
    }
  }

  /* Job action */
  async function jobAction(jobId, action) {
    await fetch('/api/admin/listings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, action }),
    });
    fetchAll();
  }

  /* Resolve flagged */
  async function resolveFlag(msgId) {
    await fetch(`/api/admin/flagged/${msgId}`, { method: 'PATCH' });
    fetchAll();
  }

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearch.toLowerCase())
  );

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 rounded-full border-4 border-brand-blue border-t-transparent animate-spin mx-auto" />
          <p className="text-[var(--text-muted)]">Admin panel yüklənir...</p>
        </div>
      </div>
    );
  }

  const c = stats?.counts || {};

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] pt-20 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">
              🛡️ Admin Panel
            </h1>
            <p className="text-sm text-[var(--text-muted)] mt-1">
              Bacar.az — Tam İdarəetmə Paneli
            </p>
          </div>
          <button onClick={fetchAll}
            className="flex items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2 text-sm font-medium text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors">
            🔄 Yenilə
          </button>
        </div>

        {actionMsg && (
          <div className="mb-4 rounded-xl bg-green-500/10 border border-green-500/30 px-4 py-3 text-sm text-green-400">
            {actionMsg}
          </div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6 p-1 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-color)]">
          <Tab active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>📊 Ümumi</Tab>
          <Tab active={activeTab === 'users'} onClick={() => setActiveTab('users')} count={users.length}>👥 İstifadəçilər</Tab>
          <Tab active={activeTab === 'listings'} onClick={() => setActiveTab('listings')} count={jobs.length}>📋 Elanlar</Tab>
          <Tab active={activeTab === 'alovlu'} onClick={() => setActiveTab('alovlu')}>🔥 Alovlu</Tab>
          <Tab active={activeTab === 'flagged'} onClick={() => setActiveTab('flagged')} count={flagged.length}>🚩 Şikayətlər</Tab>
        </div>

        {/* ─── OVERVIEW ─── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Ümumi İstifadəçi" value={c.totalUsers} icon="👥" color="#0066FF" sub={`+${c.todayUsers || 0} bu gün`} />
              <StatCard label="Ümumi Elan" value={c.totalJobs} icon="📋" color="#00C853" sub={`${c.activeJobs || 0} aktiv`} />
              <StatCard label="Müraciətlər" value={c.totalApplications} icon="📨" color="#FF6B00" sub={`${c.pendingApps || 0} gözləyir`} />
              <StatCard label="Şikayətlər" value={c.flaggedMessages} icon="🚩" color="#E91E63" sub="mesaj" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Bu Həftə" value={c.weekUsers} icon="📅" color="#9C27B0" sub="yeni qeydiyyat" />
              <StatCard label="Bu Ay" value={c.monthUsers} icon="📆" color="#FF9800" sub="yeni qeydiyyat" />
              <StatCard label="Bloklanmış" value={c.bannedUsers} icon="🚫" color="#F44336" />
              <StatCard label="VIP İstifadəçi" value={users.filter(u => u.isVip).length} icon="⭐" color="#FFD600" />
            </div>

            {/* Quick recent users */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5">
              <h3 className="font-bold text-[var(--text-primary)] mb-4">🆕 Son Qeydiyyatlar</h3>
              <div className="space-y-2">
                {users.slice(0, 5).map(u => (
                  <div key={u.id} className="flex items-center justify-between py-2 border-b border-[var(--border-color)] last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-sm font-bold text-brand-blue">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[var(--text-primary)] flex items-center gap-1">
                          {u.name}
                          {u.isVip && <span className="text-yellow-400">⭐</span>}
                          {u.bannedAt && <span className="text-red-400">🚫</span>}
                        </p>
                        <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                      </div>
                    </div>
                    <p className="text-xs text-[var(--text-muted)]">{timeAgo(u.createdAt)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── USERS ─── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                placeholder="Ad və ya email ilə axtar..."
                className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] px-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-brand-blue"
              />
              <span className="text-sm text-[var(--text-muted)]">{filteredUsers.length} nəfər</span>
            </div>

            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">İstifadəçi</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Peşə</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Elanlar</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Qeydiyyat</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-[var(--text-muted)]">Əməliyyat</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(u => (
                      <tr key={u.id} className={`border-b border-[var(--border-color)] hover:bg-[var(--bg-primary)] transition-colors ${u.bannedAt ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-blue/20 flex items-center justify-center text-sm font-bold text-brand-blue flex-shrink-0">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <p className="font-semibold text-[var(--text-primary)] flex items-center gap-1">
                                {u.name}
                                {u.isVip && <span title="VIP">⭐</span>}
                                {u.role === 'admin' && <span title="Admin" className="text-xs bg-brand-blue/20 text-brand-blue px-1 rounded">ADMIN</span>}
                              </p>
                              <p className="text-xs text-[var(--text-muted)]">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-secondary)]">
                          {u.profession || '—'}
                          {u.city && <p className="text-[var(--text-muted)]">📍 {u.city}</p>}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <span className={`inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                              u.verificationStatus === 'verified'
                                ? 'bg-green-500/10 text-green-400'
                                : 'bg-yellow-500/10 text-yellow-400'
                            }`}>
                              {u.verificationStatus === 'verified' ? '✓ Təsdiqlənmiş' : '⏳ Gözləyir'}
                            </span>
                            {u.bannedAt && <span className="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-red-500/10 text-red-400">🚫 Blok</span>}
                            {u.alovluCount > 0 && <span className="inline-flex w-fit items-center gap-1 rounded-full px-2 py-0.5 text-xs bg-orange-500/10 text-orange-400">🔥 {u.alovluCount}x</span>}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className="font-bold text-[var(--text-primary)]">{u._count?.jobs || 0}</span>
                        </td>
                        <td className="px-4 py-3 text-xs text-[var(--text-muted)]">
                          {new Date(u.createdAt).toLocaleDateString('az-AZ')}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 flex-wrap">
                            {!u.isVip ? (
                              <button onClick={() => userAction(u.id, 'makeVip')}
                                className="rounded-lg bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition-colors">
                                ⭐ VIP
                              </button>
                            ) : (
                              <button onClick={() => userAction(u.id, 'removeVip')}
                                className="rounded-lg bg-yellow-500/10 px-2 py-1 text-xs font-medium text-yellow-400 hover:bg-yellow-500/20 transition-colors">
                                VIP Çıxar
                              </button>
                            )}
                            {u.verificationStatus !== 'verified' && (
                              <button onClick={() => userAction(u.id, 'verify')}
                                className="rounded-lg bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors">
                                ✓ Təsdiqlə
                              </button>
                            )}
                            {!u.bannedAt ? (
                              <button onClick={() => userAction(u.id, 'ban')}
                                className="rounded-lg bg-red-500/10 px-2 py-1 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                                🚫 Blok
                              </button>
                            ) : (
                              <button onClick={() => userAction(u.id, 'unban')}
                                className="rounded-lg bg-green-500/10 px-2 py-1 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors">
                                Bloku Qaldır
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ─── LISTINGS ─── */}
        {activeTab === 'listings' && (
          <div className="space-y-3">
            {jobs.map(job => (
              <div key={job.id} className={`rounded-2xl border p-4 ${
                job.isAlovlu ? 'border-orange-500/50 bg-orange-500/5' : 'border-[var(--border-color)] bg-[var(--bg-card)]'
              }`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      {job.isAlovlu && <span className="text-xs font-bold text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">🔥 ALOVLU</span>}
                      <span className="text-xs font-medium text-brand-blue bg-brand-blue/10 px-2 py-0.5 rounded-full">{job.section?.toUpperCase()}</span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        job.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-400'
                      }`}>{job.paymentStatus === 'paid' ? '✓ Ödənilmiş' : '⏳ Ödəniş gözlənilir'}</span>
                    </div>
                    <p className="font-semibold text-[var(--text-primary)]">{job.title}</p>
                    <p className="text-xs text-[var(--text-muted)] mt-0.5">
                      {job.author?.name} · {job.budget} ₼ · {job._count?.applications || 0} müraciət
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {job.paymentStatus !== 'paid' && (
                      <button onClick={() => jobAction(job.id, 'approve')}
                        className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20 transition-colors">
                        ✓ Təsdiqlə
                      </button>
                    )}
                    {!job.isAlovlu && (
                      <button onClick={() => jobAction(job.id, 'makeAlovlu')}
                        className="rounded-lg bg-orange-500/10 px-3 py-1.5 text-xs font-medium text-orange-400 hover:bg-orange-500/20 transition-colors">
                        🔥 Alovlu et
                      </button>
                    )}
                    <button onClick={() => jobAction(job.id, 'reject')}
                      className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20 transition-colors">
                      Rədd et
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {jobs.length === 0 && <p className="text-center py-12 text-[var(--text-muted)]">Elan yoxdur</p>}
          </div>
        )}

        {/* ─── ALOVLU ─── */}
        {activeTab === 'alovlu' && (
          <div className="space-y-4">
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5">
              <h3 className="font-bold text-orange-400 mb-4">🔥 Alovlu Elan İdarəetməsi</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                <StatCard label="Aktiv Alovlu" value={jobs.filter(j => j.isAlovlu).length} icon="🔥" color="#FF6B00" />
                <StatCard label="VIP Üzvlər" value={users.filter(u => u.isVip).length} icon="⭐" color="#FFD600" />
                <StatCard label="VIP Astanası" value="5 alovlu" icon="🎯" color="#9C27B0" />
              </div>
              <div className="text-xs text-[var(--text-muted)] space-y-1 bg-[var(--bg-primary)] rounded-xl p-3">
                <p>• İstifadəçi 5 alovlu elan etdikdə avtomatik VIP statusu alır</p>
                <p>• Alovlu elan normal qiymətin 3 qatıdır</p>
                <p>• Admin alovlu elanlara əl ilə təsir edə bilər</p>
              </div>
            </div>
            {jobs.filter(j => j.isAlovlu).map(job => (
              <div key={job.id} className="rounded-2xl border border-orange-500/40 bg-orange-500/5 p-4">
                <p className="font-semibold text-[var(--text-primary)]">{job.title}</p>
                <p className="text-xs text-orange-400 mt-1">{job.author?.name} · {job.budget} ₼</p>
              </div>
            ))}
          </div>
        )}

        {/* ─── FLAGGED ─── */}
        {activeTab === 'flagged' && (
          <div className="space-y-3">
            {flagged.length === 0 && (
              <div className="text-center py-16 text-[var(--text-muted)]">
                <div className="text-4xl mb-3">✅</div>
                <p>Şikayət edilmiş mesaj yoxdur</p>
              </div>
            )}
            {flagged.map(msg => (
              <div key={msg.id} className="rounded-2xl border border-red-500/30 bg-red-500/5 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-red-400">{msg.sender?.name} — {msg.sender?.email}</p>
                    <p className="text-sm text-[var(--text-secondary)] mt-1 bg-[var(--bg-card)] rounded-lg px-3 py-2">
                      {'"'}{msg.body}{'"'}
                    </p>

                    {msg.flagReason && <p className="text-xs text-red-400 mt-1">Səbəb: {msg.flagReason}</p>}
                    <p className="text-xs text-[var(--text-muted)] mt-1">{timeAgo(msg.createdAt)}</p>
                  </div>
                  <div className="ml-4 flex flex-col gap-2">
                    <button onClick={() => resolveFlag(msg.id)}
                      className="rounded-lg bg-green-500/10 px-3 py-1.5 text-xs font-medium text-green-400 hover:bg-green-500/20">
                      ✓ Həll et
                    </button>
                    <button onClick={() => userAction(msg.sender?.id, 'ban')}
                      className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20">
                      🚫 Blokla
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
