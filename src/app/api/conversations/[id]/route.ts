// Purpose: Get messages for a specific conversation.
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user is participant
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: params.id,
        OR: [
          { participantAId: session.user.id },
          { participantBId: session.user.id },
        ],
      },
      include: {
        participantA: { select: { id: true, name: true, image: true } },
        participantB: { select: { id: true, name: true, image: true } },
        messages: {
          orderBy: { createdAt: "asc" },
          include: {
            sender: { select: { id: true, name: true, image: true } },
          },
        },
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Tapılmadı" }, { status: 404 });
    }

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        conversationId: params.id,
        readAt: null,
        senderId: { not: session.user.id },
      },
      data: { readAt: new Date() },
    });

    return NextResponse.json({ success: true, data: conversation });
  } catch (error) {
    console.error("Conversation GET error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
