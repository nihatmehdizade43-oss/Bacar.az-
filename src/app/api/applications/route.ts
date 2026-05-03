// Purpose: List applications for authenticated user or admin.
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const where = session.user.role === "admin" ? {} : { userId: session.user.id };
    const applications = await prisma.application.findMany({
      where,
      include: {
        job: { select: { id: true, title: true, status: true } },
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return ok(applications);
  } catch (error) {
    return handleApiError(error);
  }
}
