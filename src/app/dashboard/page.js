/* Bacar.az — Dashboard (Server-side Session) */
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getAuthSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export default async function DashboardPage() {
  const session = await getAuthSession();
  if (!session?.user) redirect('/login');

  const [jobs, applications] = await Promise.all([
    prisma.job.findMany({
      where: { authorId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
    prisma.application.findMany({
      where: { userId: session.user.id },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ]);

  return (
    <section className="min-h-[80vh] py-12 px-4">
      <div className="max-w-5xl mx-auto space-y-6">
        <header className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
          <h1 className="text-3xl font-black text-[var(--text-primary)]">Panel</h1>
          <p className="text-[var(--text-secondary)]">Xoş gəldin, {session.user.name}</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <h2 className="font-bold text-xl mb-4">Son elanlarım</h2>
            <div className="space-y-3">
              {jobs.length ? jobs.map((job) => (
                <Link className="block rounded-xl border border-[var(--border-color)] p-3 hover:border-brand-blue" href={`/is/${job.id}`} key={job.id}>
                  <p className="font-semibold">{job.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{job.category} - {job.budget} AZN</p>
                </Link>
              )) : <p className="text-sm text-[var(--text-secondary)]">Hələ elan yoxdur.</p>}
            </div>
          </div>

          <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
            <h2 className="font-bold text-xl mb-4">Müraciətlərim</h2>
            <div className="space-y-3">
              {applications.length ? applications.map((app) => (
                <div className="rounded-xl border border-[var(--border-color)] p-3" key={app.id}>
                  <p className="font-semibold">{app.job.title}</p>
                  <p className="text-sm text-[var(--text-secondary)]">{app.status}</p>
                </div>
              )) : <p className="text-sm text-[var(--text-secondary)]">Hələ müraciət yoxdur.</p>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
