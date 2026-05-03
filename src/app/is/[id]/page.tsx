// Purpose: Job detail page with secure apply form.
import { notFound } from "next/navigation";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props) {
  if (!process.env.DATABASE_URL) {
    return { title: "Elan | Bacar.az", alternates: { canonical: `/is/${params.id}` } };
  }
  const job = await prisma.job.findUnique({ where: { id: params.id } });
  if (!job) return { title: "Elan tapılmadı | Bacar.az" };
  return {
    title: `${job.title} | Bacar.az`,
    description: job.description.slice(0, 160),
    alternates: { canonical: `/is/${job.id}` },
  };
}

export default async function JobDetailPage({ params }: Props) {
  const session = await getAuthSession();
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: { author: true, applications: true },
  });
  if (!job) notFound();

  async function applyAction(formData: FormData) {
    "use server";
    const userSession = await getAuthSession();
    if (!userSession?.user) throw new Error("Unauthorized");

    const message = String(formData.get("message") || "");
    if (message.length < 10) throw new Error("Mesaj minimum 10 simvol olmalıdır.");

    await prisma.application.create({
      data: {
        jobId: params.id,
        userId: userSession.user.id,
        message,
      },
    });
  }

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="max-w-4xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <p className="text-sm text-brand-blue">{job.category}</p>
        <h1 className="text-3xl font-black mt-1">{job.title}</h1>
        <p className="mt-4 text-[var(--text-secondary)] whitespace-pre-line">{job.description}</p>
        <div className="mt-6 flex gap-6 text-sm">
          <span>Büdcə: {job.budget} AZN</span>
          <span>Deadline: {job.deadlineDays} gün</span>
          <span>Yazan: {job.author.name}</span>
        </div>

        {session?.user ? (
          <form action={applyAction} className="mt-8 space-y-3">
            <textarea
              name="message"
              className="w-full min-h-28 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-3"
              placeholder="Müraciət mesajınızı yazın..."
              required
            />
            <button className="rounded-xl bg-brand-green px-5 py-3 font-semibold text-white">Müraciət et</button>
          </form>
        ) : (
          <p className="mt-8 text-sm text-[var(--text-secondary)]">Müraciət üçün əvvəlcə daxil olun.</p>
        )}
      </div>
    </section>
  );
}
