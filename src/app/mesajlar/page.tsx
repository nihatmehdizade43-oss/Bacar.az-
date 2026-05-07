"use client";
// Purpose: Internal messaging page with anti-bypass protection UI.

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { Suspense } from "react";

type Participant = { id: string; name: string; image: string | null };
type Conversation = {
  id: string;
  participantA: Participant;
  participantB: Participant;
  messages: { body: string; filteredBody: string | null; flagged: boolean; createdAt: string; senderId: string }[];
  updatedAt: string;
};
type Message = {
  id: string;
  senderId: string;
  body: string;
  filteredBody: string | null;
  flagged: boolean;
  createdAt: string;
  sender: Participant;
};

function MessagesContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [warning, setWarning] = useState<string | null>(null);
  const [loadingConvs, setLoadingConvs] = useState(true);
  const [loadingMsgs, setLoadingMsgs] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch("/api/conversations");
      const json = await res.json();
      if (json.success) setConversations(json.data);
    } catch {}
    setLoadingConvs(false);
  }, []);

  const fetchMessages = useCallback(async (convId: string) => {
    setLoadingMsgs(true);
    try {
      const res = await fetch(`/api/conversations/${convId}`);
      const json = await res.json();
      if (json.success) setMessages(json.data.messages);
    } catch {}
    setLoadingMsgs(false);
  }, []);

  useEffect(() => { fetchConversations(); }, [fetchConversations]);

  // Open conversation from URL param
  useEffect(() => {
    const convId = searchParams.get("conv");
    if (convId) setActiveConvId(convId);
  }, [searchParams]);

  useEffect(() => {
    if (!activeConvId) return;
    fetchMessages(activeConvId);
    pollRef.current = setInterval(() => fetchMessages(activeConvId), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeConvId, fetchMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || !activeConvId || sending) return;
    setSending(true);
    setWarning(null);
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConvId, body: input.trim() }),
      });
      const json = await res.json();
      if (json.warning) setWarning(json.warning);
      if (json.success) {
        setInput("");
        await fetchMessages(activeConvId);
        await fetchConversations();
      }
    } catch {}
    setSending(false);
  }

  if (status === "loading") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  const myId = session?.user?.id ?? "";
  const activeConv = conversations.find((c) => c.id === activeConvId);
  const otherParticipant = activeConv
    ? activeConv.participantA.id === myId
      ? activeConv.participantB
      : activeConv.participantA
    : null;

  return (
    <section className="min-h-[80vh] py-6 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-black text-[var(--text-primary)] mb-6 flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-brand-blue/10 flex items-center justify-center">💬</span>
          Mesajlar
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
          {/* Conversations List */}
          <div className="md:col-span-1 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col">
            <div className="p-4 border-b border-[var(--border-color)]">
              <p className="text-sm font-semibold text-[var(--text-secondary)]">Söhbətlər</p>
            </div>
            <div className="flex-1 overflow-y-auto">
              {loadingConvs ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="p-6 text-center text-[var(--text-muted)] text-sm">
                  <div className="text-3xl mb-2">💬</div>
                  Hələ söhbət yoxdur
                </div>
              ) : (
                conversations.map((conv) => {
                  const other = conv.participantA.id === myId ? conv.participantB : conv.participantA;
                  const lastMsg = conv.messages[0];
                  const isActive = conv.id === activeConvId;
                  return (
                    <button
                      key={conv.id}
                      onClick={() => setActiveConvId(conv.id)}
                      className={`w-full text-left p-4 border-b border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors ${
                        isActive ? "bg-brand-blue/5 border-l-2 border-l-brand-blue" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                          {other.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-sm text-[var(--text-primary)] truncate">{other.name}</p>
                          {lastMsg && (
                            <p className="text-xs text-[var(--text-muted)] truncate">
                              {lastMsg.flagged ? "🔒 [Filtrələndi]" : (lastMsg.filteredBody || lastMsg.body).slice(0, 40)}
                            </p>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl overflow-hidden flex flex-col">
            {!activeConvId ? (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <div className="text-5xl mb-4">💬</div>
                  <p className="text-[var(--text-secondary)] font-medium">Söhbət seçin</p>
                  <p className="text-sm text-[var(--text-muted)] mt-1">
                    Bir freelancer-in profilinə gedib &quot;Mesaj Göndər&quot; düyməsinə basın
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="p-4 border-b border-[var(--border-color)] flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-blue to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                    {otherParticipant?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-[var(--text-primary)]">{otherParticipant?.name}</p>
                    <p className="text-xs text-[var(--text-muted)]">🔒 Əlaqə məlumatları platforma tərəfindən qorunur</p>
                  </div>
                </div>

                {/* Anti-bypass notice */}
                <div className="mx-4 mt-3 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-2">
                  <span>🛡️</span>
                  <span>Telefon, email və sosial media məlumatları avtomatik bloklanır. Platforma üzərindən əlaqə saxlayın.</span>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                  {loadingMsgs ? (
                    <div className="flex justify-center pt-8">
                      <div className="animate-spin w-6 h-6 border-2 border-brand-blue border-t-transparent rounded-full" />
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-[var(--text-muted)] text-sm pt-8">
                      Hələ mesaj yoxdur. İlk salam göndərin! 👋
                    </div>
                  ) : (
                    messages.map((msg) => {
                      const isMe = msg.senderId === myId;
                      const displayText = msg.flagged && msg.filteredBody ? msg.filteredBody : msg.body;
                      return (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                        >
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                            isMe
                              ? "bg-brand-blue text-white rounded-br-sm"
                              : "bg-[var(--bg-primary)] text-[var(--text-primary)] border border-[var(--border-color)] rounded-bl-sm"
                          }`}>
                            {msg.flagged && (
                              <p className="text-xs opacity-70 mb-1">🔒 Əlaqə məlumatı filtrələndi</p>
                            )}
                            <p className="whitespace-pre-wrap break-words">{displayText}</p>
                            <p className={`text-xs mt-1 ${isMe ? "text-white/60" : "text-[var(--text-muted)]"}`}>
                              {new Date(msg.createdAt).toLocaleTimeString("az-AZ", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Warning */}
                <AnimatePresence>
                  {warning && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mx-4 mb-2 p-2.5 rounded-lg bg-red-500/10 border border-red-500/20 text-xs text-red-500"
                    >
                      {warning}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Input */}
                <form onSubmit={sendMessage} className="p-4 border-t border-[var(--border-color)] flex gap-2">
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Mesajınızı yazın... (Əlaqə məlumatları bloklanacaq)"
                    className="flex-1 rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue/40 transition-all"
                    maxLength={2000}
                    disabled={sending}
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || sending}
                    className="px-4 py-2.5 rounded-xl bg-brand-blue text-white font-semibold text-sm disabled:opacity-40 hover:brightness-110 transition-all flex items-center gap-2"
                  >
                    {sending ? (
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : "➤"}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-brand-blue border-t-transparent rounded-full" /></div>}>
      <MessagesContent />
    </Suspense>
  );
}
