// Purpose: Conversations API — list and create conversations.
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [
          { participantAId: session.user.id },
          { participantBId: session.user.id },
        ],
      },
      include: {
        participantA: { select: { id: true, name: true, image: true } },
        participantB: { select: { id: true, name: true, image: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { body: true, filteredBody: true, flagged: true, createdAt: true, senderId: true },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ success: true, data: conversations });
  } catch (error) {
    console.error("Conversations GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { recipientId, jobId } = await request.json();
    if (!recipientId) {
      return NextResponse.json({ error: "recipientId tələb olunur" }, { status: 400 });
    }
    if (recipientId === session.user.id) {
      return NextResponse.json({ error: "Özünüzə mesaj göndərə bilməzsiniz" }, { status: 400 });
    }

    // Check if banned
    const me = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (me?.bannedAt) {
      return NextResponse.json({ error: "Hesabınız bloklanıb" }, { status: 403 });
    }

    // Ensure consistent ordering to avoid duplicates
    const [aId, bId] = [session.user.id, recipientId].sort();

    const conversation = await prisma.conversation.upsert({
      where: { participantAId_participantBId: { participantAId: aId, participantBId: bId } },
      create: {
        participantAId: aId,
        participantBId: bId,
        jobId: jobId ?? null,
      },
      update: {},
      include: {
        participantA: { select: { id: true, name: true, image: true } },
        participantB: { select: { id: true, name: true, image: true } },
        messages: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    return NextResponse.json({ success: true, data: conversation }, { status: 201 });
  } catch (error) {
    console.error("Conversations POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
