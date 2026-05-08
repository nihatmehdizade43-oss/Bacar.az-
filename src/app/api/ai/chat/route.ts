// Purpose: Bacar.az AI Assistantı — Gemini ilə daxili chatbot API.
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

const SYSTEM_PROMPT = `Sən Bacar.az-ın rəsmi AI assistantısan. Adın "BacarBot"dur.

Bacar.az haqqında:
- Azərbaycanın ilk gənc rəqəmsal freelance ekosistemidir
- 5 əsas bölmə var: Bacar (freelance iş), Vizit (AI portfolio), Ortaq (biznes şəriki), Rəhbər (mentorluq), Layihə (startap)
- İstifadəçilər iş elanı yerləşdirə, müraciət edə, portfolio yrada bilər
- Ödəniş AZN (Azərbaycan Manatı) ilə aparılır
- Sayt Azərbaycan dilindədir

Sənin vəzifələrin:
1. İstifadəçilərə Bacar.az-dan istifadəni izah et
2. Freelancer kimi necə başlamağı anlat
3. İş elanı necə yerləşdirəcəyini izah et
4. Vizit portfolio haqqında məlumat ver
5. Kateqoriyalar, büdcə, müraciət sistemi haqqında sualları cavabla
6. Azərbaycan dilini işlət (lazım olarsa İngilis və Rus dillərini də bil)

Platformanın əsas funksiyaları:
- /bacar → İş elanları (50+ kateqoriya, büdcə sürgüsü)
- /vizit → AI Portfolio generatoru
- /dashboard → Şəxsi profil paneli
- /mesajlar → Daxili mesajlaşma (anti-bypass sistemi var)
- /register → Pulsuz qeydiyyat (3 addım: ad, şifrə, peşə seçimi)

Qiymətlər (elan yerləşdirmə):
- Günlük: 0.45 ₼
- Həftəlik: 4.56 ₼  
- Aylıq: 12.93 ₼
- İllik: 47.65 ₼
- Alovlu (VIP) elan: 3x çarpan

Tövsiyə: Qısa, aydın, mehribancasına cavab ver. Emoji istifadə et. Lazım olan linkleri məntiqlə qeyd et.`;

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "messages array tələb olunur" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      systemInstruction: SYSTEM_PROMPT,
    });

    // Son istifadəçi mesajı
    const lastUserMsg = messages.filter((m: { role: string }) => m.role === "user").pop();
    if (!lastUserMsg) {
      return NextResponse.json({ error: "İstifadəçi mesajı yoxdur" }, { status: 400 });
    }

    // Söhbət tarixçəsi (Gemini formatında)
    const history = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(lastUserMsg.content);
    const text = result.response.text();

    return NextResponse.json({ reply: text });
  } catch (error: unknown) {
    console.error("AI chat error:", error);
    const message = error instanceof Error ? error.message : "AI xəta";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
