// Purpose: Freelancer profile page for networking and hiring.
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = { params: { id: string } };

export const dynamic = "force-dynamic";

export default async function FreelancerProfilePage({ params }: Props) {
  if (!process.env.DATABASE_URL) notFound();
  const user = await prisma.user.findUnique({ where: { id: params.id } });
  if (!user) notFound();

  const skills = Array.isArray(user.skills) ? user.skills : [];

  return (
    <section className="min-h-[80vh] px-4 py-12">
      <div className="max-w-3xl mx-auto rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] p-6">
        <h1 className="text-3xl font-black">{user.name}</h1>
        <p className="text-[var(--text-secondary)] mt-2">{user.bio || "Bio əlavə edilməyib."}</p>
        <p className="mt-2 text-sm">Şəhər: {user.city || "Qeyd edilməyib"}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {skills.map((skill) => (
            <span key={String(skill)} className="rounded-full bg-brand-blue/10 px-3 py-1 text-sm text-brand-blue">
              {String(skill)}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
