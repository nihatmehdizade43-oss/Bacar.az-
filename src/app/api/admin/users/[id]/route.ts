// Purpose: Admin actions on users — ban, warn, unban, promote to admin.
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { action } = await request.json();
    const userId = params.id;

    if (!["ban", "unban", "warn", "promote", "demote"].includes(action)) {
      return NextResponse.json({ error: "Yanlış əməliyyat" }, { status: 400 });
    }

    let updateData: Record<string, unknown> = {};

    switch (action) {
      case "ban":
        updateData = { bannedAt: new Date() };
        break;
      case "unban":
        updateData = { bannedAt: null, warnCount: 0 };
        break;
      case "warn":
        const user = await prisma.user.findUnique({ where: { id: userId } });
        const newCount = (user?.warnCount ?? 0) + 1;
        updateData = {
          warnCount: newCount,
          ...(newCount >= 3 ? { bannedAt: new Date() } : {}),
        };
        break;
      case "promote":
        updateData = { role: "admin" };
        break;
      case "demote":
        updateData = { role: "user" };
        break;
    }

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: { id: true, name: true, email: true, role: true, bannedAt: true, warnCount: true },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("Admin user action error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
