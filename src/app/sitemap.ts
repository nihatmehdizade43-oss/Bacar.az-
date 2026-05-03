// Purpose: Generate sitemap for SEO.
import { prisma } from "@/lib/prisma";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://bacar.az";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastModified: new Date() },
    { url: `${baseUrl}/isler`, lastModified: new Date() },
    { url: `${baseUrl}/vizit`, lastModified: new Date() },
    { url: `${baseUrl}/ortaq`, lastModified: new Date() },
    { url: `${baseUrl}/rehber`, lastModified: new Date() },
    { url: `${baseUrl}/layihe`, lastModified: new Date() },
  ];

  if (!process.env.DATABASE_URL) {
    return staticRoutes;
  }

  const jobs = await prisma.job
    .findMany({ select: { id: true, updatedAt: true } })
    .catch(() => []);

  const dynamicJobs: MetadataRoute.Sitemap = jobs.map((job) => ({
    url: `${baseUrl}/is/${job.id}`,
    lastModified: job.updatedAt || new Date(),
  }));

  return [...staticRoutes, ...dynamicJobs];
}
