// Purpose: Full-featured admin dashboard — live stats, registration tracker, management tables.
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type AdminData = {
  counts: {
    totalUsers: number;
    totalJobs: number;
    totalApplications: number;
    todayUsers: number;
    weekUsers: number;
    monthUsers: number;
    activeJobs: number;
    pendingApps: number;
  };
  recentUsers: {
    id: string;
    name: string;
    email: string;
    role: string;
    city: string | null;
    createdAt: string;
  }[];
  recentJobs: {
    id: string;
    title: string;
    status: string;
    budget: number;
    createdAt: string;
    author: { name: string; email: string };
    _count: { applications: number };
  }[];
  recentApps: {
    id: string;
    status: string;
    createdAt: string;
    user: { name: string; email: string };
    job: { title: string };
  }[];
};

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<"users" | "jobs" | "apps">("users");

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();

      if (!res.ok) {
        if (res.status === 403) {
          router.push("/admin/login");
          return;
        }
        setError(json?.error?.message ?? "Məlumatlar yüklənmədi.");
        return;
      }

      setData(json.data);
      setLastRefresh(new Date());
      setError("");
    } catch {
      setError("Server ilə əlaqə qurula bilmədi.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) {
      router.push("/admin/login");
      return;
    }
    fetchStats();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [session, status, router, fetchStats]);

  if (status === "loading" || loading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-3 border-brand-blue border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-[var(--text-secondary)]">Admin panel yüklənir...</p>
        </div>
      </section>
    );
  }

  if (error && !data) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Xəta</h2>
          <p className="text-[var(--text-secondary)] mb-4">{error}</p>
          <button
            onClick={fetchStats}
            className="px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold hover:brightness-110 transition-all"
          >
            Yenidən cəhd et
          </button>
        </div>
      </section>
    );
  }

  if (!data) return null;

  const { counts } = data;

  return (
    <section className="min-h-[80vh] py-6 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)] flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-xl">🔐</span>
              Admin Panel
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Xoş gəldin, {session?.user?.name} · Son yeniləmə: {lastRefresh.toLocaleTimeString("az-AZ")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchStats}
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all flex items-center gap-2"
            >
              🔄 Yenilə
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all"
            >
              ← Sayta qayıt
            </Link>
          </div>
        </header>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon="👥" label="Cəmi İstifadəçi" value={counts.totalUsers} color="blue" />
          <StatCard icon="💼" label="İş Elanları" value={counts.totalJobs} sub={`${counts.activeJobs} aktiv`} color="green" />
          <StatCard icon="📝" label="Müraciətlər" value={counts.totalApplications} sub={`${counts.pendingApps} gözləyən`} color="purple" />
          <StatCard
            icon="📊"
            label="Ort. Müraciət/İş"
            value={counts.totalJobs > 0 ? (counts.totalApplications / counts.totalJobs).toFixed(1) : "0"}
            color="gold"
          />
        </div>

        {/* Registration Tracker */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6"
        >
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              📈 Qeydiyyat Statistikası
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            </h2>
            <span className="text-xs text-[var(--text-muted)]">Canlı · Hər 30 saniyədə yenilənir</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RegistrationCard
              period="Bu gün"
              count={counts.todayUsers}
              icon="📅"
              gradient="from-blue-500/10 to-blue-600/5"
              border="border-blue-500/20"
              textColor="text-blue-500"
            />
            <RegistrationCard
              period="Bu həftə"
              count={counts.weekUsers}
              icon="📆"
              gradient="from-green-500/10 to-green-600/5"
              border="border-green-500/20"
              textColor="text-green-500"
            />
            <RegistrationCard
              period="Bu ay"
              count={counts.monthUsers}
              icon="🗓️"
              gradient="from-purple-500/10 to-purple-600/5"
              border="border-purple-500/20"
              textColor="text-purple-500"
            />
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-1 gap-1">
          {[
            { key: "users" as const, label: "👥 İstifadəçilər", count: counts.totalUsers },
            { key: "jobs" as const, label: "💼 İş Elanları", count: counts.totalJobs },
            { key: "apps" as const, label: "📝 Müraciətlər", count: counts.totalApplications },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key
                  ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}
            >
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.key ? "bg-white/20" : "bg-[var(--bg-primary)]"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {activeTab === "users" && (
            <TabPanel key="users">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Ad</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Rol</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Şəhər</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Qeydiyyat</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.recentUsers.map((u, i) => (
                    <tr key={u.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{u.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          u.role === "admin" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"
                        }`}>
                          {u.role === "admin" ? "Admin" : "İstifadəçi"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{u.city ?? "—"}</td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                        {new Date(u.createdAt).toLocaleString("az-AZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                  {data.recentUsers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                        Hələ istifadəçi yoxdur
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabPanel>
          )}

          {activeTab === "jobs" && (
            <TabPanel key="jobs">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Başlıq</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Müəllif</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Büdcə</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Müraciət</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.recentJobs.map((j, i) => (
                    <tr key={j.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)] max-w-[200px] truncate">{j.title}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{j.author.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] font-medium">{j.budget} ₼</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">
                          {j._count.applications} nəfər
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          j.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"
                        }`}>
                          {j.status === "active" ? "Aktiv" : "Bağlı"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {data.recentJobs.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                        Hələ elan yoxdur
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabPanel>
          )}

          {activeTab === "apps" && (
            <TabPanel key="apps">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">#</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">İstifadəçi</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">İş Elanı</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">Tarix</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.recentApps.map((a, i) => (
                    <tr key={a.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{a.user.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{a.user.email}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">{a.job.title}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          a.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : a.status === "accepted"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                        }`}>
                          {a.status === "pending" ? "Gözləyir" : a.status === "accepted" ? "Qəbul" : "Rədd"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                        {new Date(a.createdAt).toLocaleString("az-AZ", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                    </tr>
                  ))}
                  {data.recentApps.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[var(--text-muted)]">
                        Hələ müraciət yoxdur
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TabPanel>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Sub-components ────────────────────────────────── */

function StatCard({
  icon,
  label,
  value,
  sub,
  color,
}: {
  icon: string;
  label: string;
  value: number | string;
  sub?: string;
  color: "blue" | "green" | "purple" | "gold";
}) {
  const styles = {
    blue: { bg: "from-blue-500/10 to-blue-600/5 border-blue-500/20", text: "text-blue-500" },
    green: { bg: "from-green-500/10 to-green-600/5 border-green-500/20", text: "text-green-500" },
    purple: { bg: "from-purple-500/10 to-purple-600/5 border-purple-500/20", text: "text-purple-500" },
    gold: { bg: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20", text: "text-yellow-500" },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-br p-5 ${styles[color].bg}`}
    >
      <span className="text-2xl">{icon}</span>
      <div className={`text-3xl font-black mt-2 ${styles[color].text}`}>{value}</div>
      <div className="text-sm font-medium text-[var(--text-secondary)] mt-1">{label}</div>
      {sub && <div className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function RegistrationCard({
  period,
  count,
  icon,
  gradient,
  border,
  textColor,
}: {
  period: string;
  count: number;
  icon: string;
  gradient: string;
  border: string;
  textColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border bg-gradient-to-br p-5 text-center ${gradient} ${border}`}
    >
      <span className="text-2xl">{icon}</span>
      <div className={`text-4xl font-black mt-2 ${textColor}`}>{count}</div>
      <div className="text-sm font-medium text-[var(--text-secondary)] mt-1">{period}</div>
      <div className="text-xs text-[var(--text-muted)] mt-0.5">yeni qeydiyyat</div>
    </motion.div>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden"
    >
      <div className="overflow-x-auto">{children}</div>
    </motion.div>
  );
}
