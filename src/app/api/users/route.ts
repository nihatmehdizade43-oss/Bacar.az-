// Purpose: Users list and registration endpoint.
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { registerSchema } from "@/lib/validations";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        city: true,
        bio: true,
        skills: true,
        mentor: true,
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
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    return ok(user, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
