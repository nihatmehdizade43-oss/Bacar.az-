// Purpose: Send message with contact-info filtering for anti-bypass protection.
import { NextResponse } from "next/server";
import { getAuthSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { filterMessage } from "@/lib/messageFilter";

export async function POST(request: Request) {
  try {
    const session = await getAuthSession();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check ban
    const sender = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (sender?.bannedAt) {
      return NextResponse.json(
        { error: "Hesabınız bloklanıb. Ətraflı məlumat üçün admin ilə əlaqə saxlayın." },
        { status: 403 }
      );
    }

    const { conversationId, body } = await request.json();
    if (!conversationId || !body?.trim()) {
      return NextResponse.json({ error: "conversationId və mətn tələb olunur" }, { status: 400 });
    }
    if (body.trim().length > 2000) {
      return NextResponse.json({ error: "Mesaj çox uzundur (maks. 2000 simvol)" }, { status: 400 });
    }

    // Verify user is participant in this conversation
    const conversation = await prisma.conversation.findFirst({
      where: {
        id: conversationId,
        OR: [
          { participantAId: session.user.id },
          { participantBId: session.user.id },
        ],
      },
    });

    if (!conversation) {
      return NextResponse.json({ error: "Söhbət tapılmadı" }, { status: 404 });
    }

    // Run anti-bypass filter
    const { filteredBody, flagged, flagReason } = filterMessage(body.trim());

    // Save the message (always save, but with filtered content)
    const message = await prisma.message.create({
      data: {
        conversationId,
        senderId: session.user.id,
        body: body.trim(),
        filteredBody: flagged ? filteredBody : null,
        flagged,
        flagReason,
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
      },
    });

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    // Handle warnings on flag
    let warningMessage: string | null = null;
    if (flagged && sender) {
      const newWarnCount = (sender.warnCount ?? 0) + 1;

      if (newWarnCount >= 3) {
        // Ban user after 3 violations
        await prisma.user.update({
          where: { id: session.user.id },
          data: { warnCount: newWarnCount, bannedAt: new Date() },
        });
        warningMessage =
          "⛔ Hesabınız bloklandı. Əlaqə məlumatı paylaşmaq platforma qaydalarını pozur.";
      } else {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { warnCount: newWarnCount },
        });
        warningMessage = `⚠️ Xəbərdarlıq ${newWarnCount}/3: Platforma xaricində əlaqə məlumatı paylaşmaq qadağandır. Mesajınız filtrələndi.`;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...message,
        // Always send filtered version to client
        displayBody: flagged ? filteredBody : body.trim(),
      },
      warning: warningMessage,
      flagged,
    });
  } catch (error) {
    console.error("Messages POST error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
