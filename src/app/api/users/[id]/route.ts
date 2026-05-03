// Purpose: Read and update one user profile.
import { prisma } from "@/lib/prisma";
import { fail, handleApiError, ok } from "@/lib/api";
import { getAuthSession } from "@/lib/auth";

type RouteContext = { params: { id: string } };

export async function GET(_: Request, { params }: RouteContext) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        city: true,
        bio: true,
        skills: true,
        mentor: true,
        image: true,
        createdAt: true,
      },
    });

    if (!user) return fail("User not found", 404);
    return ok(user);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: RouteContext) {
  try {
    const session = await getAuthSession();
    if (!session?.user) return fail("Unauthorized", 401);
    if (session.user.id !== params.id && session.user.role !== "admin") return fail("Forbidden", 403);

    const payload = (await request.json()) as {
      name?: string;
      city?: string;
      bio?: string;
      skills?: string[];
      image?: string;
    };

    const user = await prisma.user.update({
      where: { id: params.id },
      data: {
        name: payload.name,
        city: payload.city,
        bio: payload.bio,
        skills: payload.skills,
        image: payload.image,
      },
    });

    return ok(user);
  } catch (error) {
    return handleApiError(error);
  }
}
