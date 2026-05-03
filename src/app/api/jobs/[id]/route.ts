// Purpose: Single job endpoint.
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { jobSchema } from "@/lib/validations";

type RouteContext = { params: { id: string } };

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const job = await prisma.job.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, city: true } },
        applications: {
          include: {
            user: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    if (!job) return fail("Job not found", 404);
    return ok(job);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const existing = await prisma.job.findUnique({ where: { id: params.id } });
    if (!existing) return fail("Job not found", 404);
    if (existing.authorId !== session.user.id && session.user.role !== "admin") return fail("Forbidden", 403);

    const payload = await request.json();
    const parsed = jobSchema.partial().safeParse(payload);
    if (!parsed.success) return fail("Validation error", 422, parsed.error.flatten());

    const updated = await prisma.job.update({
      where: { id: params.id },
      data: parsed.data,
    });
    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const existing = await prisma.job.findUnique({ where: { id: params.id } });
    if (!existing) return fail("Job not found", 404);
    if (existing.authorId !== session.user.id && session.user.role !== "admin") return fail("Forbidden", 403);

    await prisma.job.delete({ where: { id: params.id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
