// Purpose: Full admin dashboard — stats, flagged messages, user management, contracts.
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

type User = {
  id: string; name: string; email: string; role: string;
  city: string | null; bannedAt: string | null; warnCount: number; createdAt: string;
};
type Job = {
  id: string; title: string; status: string; budget: number; createdAt: string;
  author: { name: string; email: string }; _count: { applications: number };
};
type App = {
  id: string; status: string; createdAt: string;
  user: { name: string; email: string }; job: { title: string };
};
type FlaggedMsg = {
  id: string; body: string; filteredBody: string | null; flagReason: string | null; createdAt: string;
  sender: { id: string; name: string; email: string };
};
type AdminData = {
  counts: {
    totalUsers: number; totalJobs: number; totalApplications: number;
    todayUsers: number; weekUsers: number; monthUsers: number;
    activeJobs: number; pendingApps: number; flaggedMessages: number; bannedUsers: number;
  };
  recentUsers: User[];
  recentJobs: Job[];
  recentApps: App[];
  flaggedMessages: FlaggedMsg[];
};

type Tab = "users" | "jobs" | "apps" | "flagged";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<Tab>("users");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const json = await res.json();
      if (!res.ok) {
        if (res.status === 403) { router.push("/admin/login"); return; }
        setError(json?.error?.message ?? "Məlumatlar yüklənmədi.");
        return;
      }
      setData(json.data);
      setLastRefresh(new Date());
      setError("");
    } catch { setError("Server ilə əlaqə qurula bilmədi."); }
    finally { setLoading(false); }
  }, [router]);

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.user) { router.push("/admin/login"); return; }
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [session, status, router, fetchStats]);

  async function userAction(userId: string, action: string) {
    setActionLoading(userId + action);
    try {
      await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      await fetchStats();
    } catch {}
    setActionLoading(null);
  }

  if (status === "loading" || loading) {
    return (
      <section className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-brand-blue border-t-transparent rounded-full mx-auto mb-4" />
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
          <button onClick={fetchStats} className="px-6 py-3 rounded-xl bg-brand-blue text-white font-semibold">
            Yenidən cəhd et
          </button>
        </div>
      </section>
    );
  }

  if (!data) return null;
  const { counts } = data;

  const tabs: { key: Tab; label: string; count: number; alert?: boolean }[] = [
    { key: "users", label: "👥 İstifadəçilər", count: counts.totalUsers },
    { key: "jobs", label: "💼 İş Elanları", count: counts.totalJobs },
    { key: "apps", label: "📝 Müraciətlər", count: counts.totalApplications },
    { key: "flagged", label: "🚩 Şübhəli Mesajlar", count: counts.flaggedMessages, alert: counts.flaggedMessages > 0 },
  ];

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
            <button onClick={fetchStats} className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all flex items-center gap-2">
              🔄 Yenilə
            </button>
            <Link href="/" className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-sm font-semibold text-[var(--text-secondary)] hover:bg-[var(--bg-card-hover)] transition-all">
              ← Sayta qayıt
            </Link>
          </div>
        </header>

        {/* Main Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          <StatCard icon="👥" label="İstifadəçi" value={counts.totalUsers} color="blue" />
          <StatCard icon="💼" label="İş Elanları" value={counts.totalJobs} sub={`${counts.activeJobs} aktiv`} color="green" />
          <StatCard icon="📝" label="Müraciət" value={counts.totalApplications} sub={`${counts.pendingApps} gözləyən`} color="purple" />
          <StatCard icon="🚩" label="Şübhəli Mesaj" value={counts.flaggedMessages} color="red" />
          <StatCard icon="⛔" label="Bloklu User" value={counts.bannedUsers} color="orange" />
          <StatCard icon="📊" label="Ort. Müraciət" value={counts.totalJobs > 0 ? (counts.totalApplications / counts.totalJobs).toFixed(1) : "0"} color="gold" />
        </div>

        {/* Registration Tracker */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              📈 Qeydiyyat Statistikası
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
            </h2>
            <span className="text-xs text-[var(--text-muted)]">Canlı · Hər 30 saniyədə yenilənir</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <RegCard period="Bu gün" count={counts.todayUsers} icon="📅" gradient="from-blue-500/10 to-blue-600/5" border="border-blue-500/20" textColor="text-blue-500" />
            <RegCard period="Bu həftə" count={counts.weekUsers} icon="📆" gradient="from-green-500/10 to-green-600/5" border="border-green-500/20" textColor="text-green-500" />
            <RegCard period="Bu ay" count={counts.monthUsers} icon="🗓️" gradient="from-purple-500/10 to-purple-600/5" border="border-purple-500/20" textColor="text-purple-500" />
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] p-1 gap-1 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex-1 min-w-max py-2.5 px-3 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.key ? "bg-brand-blue text-white shadow-lg shadow-blue-500/20" : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]"
              }`}>
              {tab.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                tab.alert ? "bg-red-500 text-white animate-pulse" :
                activeTab === tab.key ? "bg-white/20" : "bg-[var(--bg-primary)]"
              }`}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          {/* Users Tab */}
          {activeTab === "users" && (
            <TabPanel key="users">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    {["#", "Ad", "Email", "Rol", "Şəhər", "Xəbərdarlıq", "Status", "Qeydiyyat", "Əməliyyat"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.recentUsers.map((u, i) => (
                    <tr key={u.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{u.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${u.role === "admin" ? "bg-red-500/10 text-red-500" : "bg-blue-500/10 text-blue-500"}`}>
                          {u.role === "admin" ? "Admin" : "İstifadəçi"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{u.city ?? "—"}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold ${u.warnCount >= 2 ? "text-red-500" : u.warnCount === 1 ? "text-yellow-500" : "text-[var(--text-muted)]"}`}>
                          {u.warnCount}/3
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {u.bannedAt ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">⛔ Bloklu</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-green-500/10 text-green-500">✓ Aktiv</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs whitespace-nowrap">
                        {new Date(u.createdAt).toLocaleDateString("az-AZ")}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          {u.bannedAt ? (
                            <ActionBtn onClick={() => userAction(u.id, "unban")} loading={actionLoading === u.id + "unban"} color="green" title="Bloku aç">✓</ActionBtn>
                          ) : (
                            <>
                              <ActionBtn onClick={() => userAction(u.id, "warn")} loading={actionLoading === u.id + "warn"} color="yellow" title="Xəbərdarlıq">⚠</ActionBtn>
                              <ActionBtn onClick={() => userAction(u.id, "ban")} loading={actionLoading === u.id + "ban"} color="red" title="Blokla">⛔</ActionBtn>
                            </>
                          )}
                          {u.role !== "admin" ? (
                            <ActionBtn onClick={() => userAction(u.id, "promote")} loading={actionLoading === u.id + "promote"} color="purple" title="Admin et">👑</ActionBtn>
                          ) : (
                            <ActionBtn onClick={() => userAction(u.id, "demote")} loading={actionLoading === u.id + "demote"} color="gray" title="Adminlikdən çıxar">↓</ActionBtn>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          )}

          {/* Jobs Tab */}
          {activeTab === "jobs" && (
            <TabPanel key="jobs">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    {["#", "Başlıq", "Müəllif", "Büdcə", "Müraciət", "Status", "Tarix"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.recentJobs.map((j, i) => (
                    <tr key={j.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)] max-w-[200px] truncate">{j.title}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">{j.author.name}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-secondary)]">{j.budget} ₼</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-500">{j._count.applications} nəfər</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${j.status === "active" ? "bg-green-500/10 text-green-500" : "bg-gray-500/10 text-gray-500"}`}>
                          {j.status === "active" ? "Aktiv" : "Bağlı"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{new Date(j.createdAt).toLocaleDateString("az-AZ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          )}

          {/* Applications Tab */}
          {activeTab === "apps" && (
            <TabPanel key="apps">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    {["#", "İstifadəçi", "Email", "İş Elanı", "Status", "Tarix"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {data.recentApps.map((a, i) => (
                    <tr key={a.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                      <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{a.user.name}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{a.user.email}</td>
                      <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">{a.job.title}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          a.status === "pending" ? "bg-yellow-500/10 text-yellow-500" :
                          a.status === "accepted" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                        }`}>
                          {a.status === "pending" ? "Gözləyir" : a.status === "accepted" ? "Qəbul" : "Rədd"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">{new Date(a.createdAt).toLocaleDateString("az-AZ")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TabPanel>
          )}

          {/* Flagged Messages Tab */}
          {activeTab === "flagged" && (
            <TabPanel key="flagged">
              {data.flaggedMessages.length === 0 ? (
                <div className="p-12 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="text-[var(--text-secondary)] font-medium">Şübhəli mesaj yoxdur</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">Bütün mesajlar təmizdir</p>
                </div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--bg-primary)]">
                      {["#", "Göndərən", "Email", "Orijinal Mətn", "Filtrlənib", "Səbəb", "Tarix", "Əməliyyat"].map((h) => (
                        <th key={h} className="px-4 py-3 text-left font-semibold text-[var(--text-secondary)] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border-color)]">
                    {data.flaggedMessages.map((msg, i) => (
                      <tr key={msg.id} className="hover:bg-[var(--bg-card-hover)] transition-colors">
                        <td className="px-4 py-3 text-[var(--text-muted)]">{i + 1}</td>
                        <td className="px-4 py-3 font-medium text-[var(--text-primary)]">{msg.sender.name}</td>
                        <td className="px-4 py-3 text-[var(--text-secondary)] text-xs">{msg.sender.email}</td>
                        <td className="px-4 py-3 text-red-500 text-xs max-w-[150px] truncate">{msg.body}</td>
                        <td className="px-4 py-3 text-[var(--text-muted)] text-xs max-w-[150px] truncate">{msg.filteredBody ?? "—"}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500">{msg.flagReason}</span>
                        </td>
                        <td className="px-4 py-3 text-[var(--text-muted)] text-xs whitespace-nowrap">
                          {new Date(msg.createdAt).toLocaleDateString("az-AZ")}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <ActionBtn onClick={() => userAction(msg.sender.id, "warn")} loading={actionLoading === msg.sender.id + "warn"} color="yellow" title="Xəbərdarlıq">⚠</ActionBtn>
                            <ActionBtn onClick={() => userAction(msg.sender.id, "ban")} loading={actionLoading === msg.sender.id + "ban"} color="red" title="Blokla">⛔</ActionBtn>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </TabPanel>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ─── Sub-components ─── */
function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: number | string; sub?: string; color: string }) {
  const styles: Record<string, string> = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-500",
    green: "from-green-500/10 to-green-600/5 border-green-500/20 text-green-500",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-500",
    red: "from-red-500/10 to-red-600/5 border-red-500/20 text-red-500",
    orange: "from-orange-500/10 to-orange-600/5 border-orange-500/20 text-orange-500",
    gold: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20 text-yellow-500",
  };
  const [bg, text] = styles[color]?.split(" text-") ?? ["", ""];
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-2xl border bg-gradient-to-br p-4 ${bg} border-${color === "blue" ? "blue" : color}-500/20`}>
      <span className="text-xl">{icon}</span>
      <div className={`text-2xl font-black mt-2 text-${color}-500`}>{value}</div>
      <div className="text-xs font-medium text-[var(--text-secondary)] mt-1">{label}</div>
      {sub && <div className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function RegCard({ period, count, icon, gradient, border, textColor }: { period: string; count: number; icon: string; gradient: string; border: string; textColor: string }) {
  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
      className={`rounded-xl border bg-gradient-to-br p-5 text-center ${gradient} ${border}`}>
      <span className="text-2xl">{icon}</span>
      <div className={`text-4xl font-black mt-2 ${textColor}`}>{count}</div>
      <div className="text-sm font-medium text-[var(--text-secondary)] mt-1">{period}</div>
      <div className="text-xs text-[var(--text-muted)] mt-0.5">yeni qeydiyyat</div>
    </motion.div>
  );
}

function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
      className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
      <div className="overflow-x-auto">{children}</div>
    </motion.div>
  );
}

function ActionBtn({ onClick, loading, color, title, children }: {
  onClick: () => void; loading: boolean; color: string; title: string; children: React.ReactNode;
}) {
  const colors: Record<string, string> = {
    red: "bg-red-500/10 text-red-500 hover:bg-red-500/20",
    yellow: "bg-yellow-500/10 text-yellow-500 hover:bg-yellow-500/20",
    green: "bg-green-500/10 text-green-500 hover:bg-green-500/20",
    purple: "bg-purple-500/10 text-purple-500 hover:bg-purple-500/20",
    gray: "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20",
  };
  return (
    <button onClick={onClick} disabled={loading} title={title}
      className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all disabled:opacity-40 ${colors[color]}`}>
      {loading ? <span className="animate-spin">◌</span> : children}
    </button>
  );
}
