// Purpose: Users list and registration with welcome notification + privacy policy.
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { registerSchema } from "@/lib/validations";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true, email: true, name: true, role: true,
        city: true, bio: true, skills: true, mentor: true,
        profession: true, activityAreas: true, verificationStatus: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });
    return ok(users);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = registerSchema.safeParse(payload);
    if (!parsed.success) return fail("Validation error", 422, parsed.error.flatten());

    const email = parsed.data.email.toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return fail("Bu email artıq istifadə olunur.", 409);

    const passwordHash = await bcrypt.hash(parsed.data.password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        name: parsed.data.name,
        passwordHash,
        profession: (payload.profession as string) || null,
        activityAreas: (payload.activityAreas as string[]) || [],
        privacyAccepted: payload.privacyAccepted === true,
      },
      select: { id: true, email: true, name: true, role: true },
    });

    // Auto-create welcome notification
    await prisma.notification.create({
      data: {
        userId: user.id,
        title: "🎉 Bacar.az-a xoş gəldiniz!",
        body: `Salam ${user.name}! Hesabınız uğurla yaradıldı. İndi elanlar tapmaq, freelancerlərlə əlaqə qurmaq və AI portfolio yaratmaq üçün platformadan istifadə edə bilərsiniz.`,
        type: "welcome",
        link: "/dashboard",
      },
    });

    return ok(user, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
