// Purpose: Admin-only control panel for basic moderation stats.
import { redirect } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Admin | Bacar.az",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "admin") redirect("/dashboard");

  const [users, jobs, applications] = await Promise.all([
    prisma.user.count(),
    prisma.job.count(),
    prisma.application.count(),
  ]);

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black mb-6">Admin Panel</h1>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">İstifadəçi: {users}</div>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">Elan: {jobs}</div>
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">Müraciət: {applications}</div>
        </div>
      </div>
    </section>
  );
}
