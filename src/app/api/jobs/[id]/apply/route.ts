// Purpose: Apply to a job with authenticated user.
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";
import { applicationSchema } from "@/lib/validations";

type RouteContext = { params: { id: string } };

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const payload = await request.json();
    const parsed = applicationSchema.safeParse(payload);
    if (!parsed.success) return fail("Validation error", 422, parsed.error.flatten());

    const job = await prisma.job.findUnique({ where: { id: params.id } });
    if (!job) return fail("Job not found", 404);

    const application = await prisma.application.create({
      data: {
        jobId: params.id,
        userId: session.user.id,
        message: parsed.data.message,
      },
    });

    return ok(application, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
