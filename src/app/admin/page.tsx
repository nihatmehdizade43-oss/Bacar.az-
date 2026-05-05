// Purpose: Full admin dashboard with stats, users, jobs, and applications management.
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin Panel | Bacar.az",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/admin/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const [users, jobs, applications, recentUsers, recentJobs, recentApps] =
    await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          city: true,
          createdAt: true,
        },
      }),
      prisma.job.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          author: { select: { name: true, email: true } },
          _count: { select: { applications: true } },
        },
      }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          user: { select: { name: true, email: true } },
          job: { select: { title: true } },
        },
      }),
    ]);

  const activeJobs = await prisma.job.count({ where: { status: "active" } });
  const pendingApps = await prisma.application.count({
    where: { status: "pending" },
  });

  return (
    <section className="min-h-[80vh] py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-[var(--text-primary)]">
              🔐 Admin Panel
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Xoş gəldin, {session.user.name} · Admin
            </p>
          </div>
          <Link
            href="/"
            className="text-sm text-brand-blue hover:underline"
          >
            ← Sayta qayıt
          </Link>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard
            icon="👥"
            label="İstifadəçilər"
            value={users}
            color="blue"
          />
          <StatCard
            icon="💼"
            label="İş Elanları"
            value={jobs}
            sub={`${activeJobs} aktiv`}
            color="green"
          />
          <StatCard
            icon="📝"
            label="Müraciətlər"
            value={applications}
            sub={`${pendingApps} gözləyən`}
            color="purple"
          />
          <StatCard
            icon="📊"
            label="Ort. Müraciət/İş"
            value={jobs > 0 ? (applications / jobs).toFixed(1) : "0"}
            color="gold"
          />
        </div>

        {/* Tables */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Users Table */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="font-bold text-lg text-[var(--text-primary)]">
                👥 Son İstifadəçilər
              </h2>
              <span className="text-xs text-[var(--text-muted)]">
                Cəmi: {users}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Ad
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Email
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Rol
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Tarix
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {recentUsers.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-[var(--bg-card-hover)] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                        {u.name}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {u.email}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            u.role === "admin"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-blue-500/10 text-blue-500"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                        {new Date(u.createdAt).toLocaleDateString("az-AZ")}
                      </td>
                    </tr>
                  ))}
                  {recentUsers.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-[var(--text-muted)]"
                      >
                        Hələ istifadəçi yoxdur
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
              <h2 className="font-bold text-lg text-[var(--text-primary)]">
                💼 Son İş Elanları
              </h2>
              <span className="text-xs text-[var(--text-muted)]">
                Cəmi: {jobs}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--bg-primary)]">
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Başlıq
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Müəllif
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Müraciət
                    </th>
                    <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {recentJobs.map((j) => (
                    <tr
                      key={j.id}
                      className="hover:bg-[var(--bg-card-hover)] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-[var(--text-primary)] max-w-[180px] truncate">
                        {j.title}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {j.author.name}
                      </td>
                      <td className="px-4 py-3 text-[var(--text-secondary)]">
                        {j._count.applications}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                            j.status === "active"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-gray-500/10 text-gray-500"
                          }`}
                        >
                          {j.status === "active" ? "Aktiv" : "Bağlı"}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {recentJobs.length === 0 && (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-4 py-6 text-center text-[var(--text-muted)]"
                      >
                        Hələ elan yoxdur
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Applications Table — Full Width */}
        <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] overflow-hidden">
          <div className="px-6 py-4 border-b border-[var(--border-color)] flex items-center justify-between">
            <h2 className="font-bold text-lg text-[var(--text-primary)]">
              📝 Son Müraciətlər
            </h2>
            <span className="text-xs text-[var(--text-muted)]">
              Cəmi: {applications}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-[var(--bg-primary)]">
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                    İstifadəçi
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                    Email
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                    İş Elanı
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                    Status
                  </th>
                  <th className="px-4 py-2.5 text-left font-semibold text-[var(--text-secondary)]">
                    Tarix
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-color)]">
                {recentApps.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-[var(--bg-card-hover)] transition-colors"
                  >
                    <td className="px-4 py-3 font-medium text-[var(--text-primary)]">
                      {a.user.name}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)]">
                      {a.user.email}
                    </td>
                    <td className="px-4 py-3 text-[var(--text-secondary)] max-w-[200px] truncate">
                      {a.job.title}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-xs font-semibold ${
                          a.status === "pending"
                            ? "bg-yellow-500/10 text-yellow-500"
                            : a.status === "accepted"
                              ? "bg-green-500/10 text-green-500"
                              : "bg-red-500/10 text-red-500"
                        }`}
                      >
                        {a.status === "pending"
                          ? "Gözləyir"
                          : a.status === "accepted"
                            ? "Qəbul"
                            : "Rədd"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--text-muted)] text-xs">
                      {new Date(a.createdAt).toLocaleDateString("az-AZ")}
                    </td>
                  </tr>
                ))}
                {recentApps.length === 0 && (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-6 text-center text-[var(--text-muted)]"
                    >
                      Hələ müraciət yoxdur
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

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
  const colorMap = {
    blue: "from-blue-500/10 to-blue-600/5 border-blue-500/20",
    green: "from-green-500/10 to-green-600/5 border-green-500/20",
    purple: "from-purple-500/10 to-purple-600/5 border-purple-500/20",
    gold: "from-yellow-500/10 to-yellow-600/5 border-yellow-500/20",
  };

  const textColorMap = {
    blue: "text-blue-500",
    green: "text-green-500",
    purple: "text-purple-500",
    gold: "text-yellow-500",
  };

  return (
    <div
      className={`rounded-2xl border bg-gradient-to-br p-5 ${colorMap[color]}`}
    >
      <span className="text-2xl">{icon}</span>
      <div className={`text-3xl font-black mt-2 ${textColorMap[color]}`}>
        {value}
      </div>
      <div className="text-sm font-medium text-[var(--text-secondary)] mt-1">
        {label}
      </div>
      {sub && (
        <div className="text-xs text-[var(--text-muted)] mt-0.5">{sub}</div>
      )}
    </div>
  );
}
