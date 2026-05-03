// Purpose: Jobs listing page powered by backend API data.
import { prisma } from "@/lib/prisma";
import JobsInteractive from "@/components/isler/JobsInteractive";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "İş Elanları | Bacar.az",
  description: "Freelance və startup iş elanlarını kəşf et.",
  alternates: { canonical: "/isler" },
};

export default async function JobsPage() {
  let jobs: Array<{
    id: string;
    title: string;
    description: string;
    budget: number;
    category: string;
    author: { name: string | null };
  }> = [];

  if (process.env.DATABASE_URL) {
    jobs = await prisma.job.findMany({
      include: { author: { select: { name: true } } },
      where: { status: "active" },
      orderBy: { createdAt: "desc" },
    });
  }

  return (
    <JobsInteractive
      jobs={jobs.map((job) => ({
        id: String(job.id),
        title: job.title,
        description: job.description,
        budget: job.budget,
        category: job.category,
        author: { name: job.author.name },
      }))}
    />
  );
}
