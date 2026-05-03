// Purpose: Jobs list/create/update/delete collection endpoint.
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { jobSchema } from "@/lib/validations";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      include: {
        author: {
          select: { id: true, name: true, city: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(jobs);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const payload = await request.json();
    const parsed = jobSchema.safeParse(payload);
    if (!parsed.success) return fail("Validation error", 422, parsed.error.flatten());

    const job = await prisma.job.create({
      data: {
        ...parsed.data,
        authorId: session.user.id,
      },
    });

    return ok(job, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const payload = (await request.json()) as { id?: string } & Record<string, unknown>;
    if (!payload.id) return fail("Job id is required", 400);

    const existing = await prisma.job.findUnique({ where: { id: payload.id } });
    if (!existing) return fail("Job not found", 404);
    if (existing.authorId !== session.user.id && session.user.role !== "admin") return fail("Forbidden", 403);

    const parsed = jobSchema.partial().safeParse(payload);
    if (!parsed.success) return fail("Validation error", 422, parsed.error.flatten());

    const updated = await prisma.job.update({
      where: { id: payload.id },
      data: parsed.data,
    });

    return ok(updated);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) return fail("Job id is required", 400);

    const existing = await prisma.job.findUnique({ where: { id } });
    if (!existing) return fail("Job not found", 404);
    if (existing.authorId !== session.user.id && session.user.role !== "admin") return fail("Forbidden", 403);

    await prisma.job.delete({ where: { id } });
    return ok({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
