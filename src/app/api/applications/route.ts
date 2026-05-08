// Purpose: Applications API — list (GET) + create with auto-notification (POST).
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

/* ── GET — İstifadəçinin müraciətlərini al ───────────────── */
export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);

    const where =
      session.user.role === "admin" ? {} : { userId: session.user.id };

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

/* ── POST — Müraciət yarat + elan sahibinə bildiriş ─────── */
export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Daxil olmamısınız", 401);

    const body = await request.json();
    const { jobId, jobTitle, posterUserId, offeredPrice, timeline, message } = body;

    if (!jobId || !message) {
      return fail("jobId və message tələb olunur", 400);
    }

    // Müraciəti yarat
    const application = await prisma.application.create({
      data: {
        jobId,
        userId: session.user.id,
        message,
        status: "pending",
      },
    });

    // Elan sahibinə bildiriş göndər (varsa)
    if (posterUserId && posterUserId !== session.user.id) {
      await prisma.notification.create({
        data: {
          userId: posterUserId,
          type: "application",
          title: "Yeni müraciət!",
          body: `${session.user.name ?? "Bir istifadəçi"} "${jobTitle ?? "elanınıza"}" müraciət etdi${offeredPrice ? ` — Təklif: ${offeredPrice} ₼` : ""}.`,
          link: "/dashboard",
        },
      });

      // Müraciətçiyə təsdiq bildirişi
      await prisma.notification.create({
        data: {
          userId: session.user.id,
          type: "system",
          title: "Müraciətiniz göndərildi ✅",
          body: `"${jobTitle ?? "Elan"}" üçün müraciətiniz elan sahibinə çatdırıldı. Söhbət açıldı.`,
          link: "/mesajlar",
        },
      });
    }

    return ok({ id: application.id, message: "Müraciət göndərildi" }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
