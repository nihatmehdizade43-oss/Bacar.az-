/* ============================================================
   Bacar.az — BacarBot AI Chat Widget
   • Hər səhifədə sağ aşağıda üzən düymə
   • Açıldıqda tam chat interfeysi
   • Gemini AI ilə gücləndirilmiş
   ============================================================ */
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';

const QUICK_QUESTIONS = [
  'Necə elan yerləşdirim?',
  'Portfolio necə yatadım?',
  'Qiymətlər necədir?',
  'Müraciət sistemi necə işləyir?',
];

function MarkdownText({ text }) {
  // Sadə markdown: **bold**, *italic*, linkləri
  const html = text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/`(.*?)`/g, '<code class="bg-white/10 px-1 rounded text-xs">$1</code>')
    .replace(/\n/g, '<br/>');
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

export default function AiChat() {
  const [open, setOpen]         = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Salam! Mən **BacarBot**-am 🤖\n\nBacar.az haqqında hər hansı sualınız var? Kömək etməyə hazıram! 👋',
    },
  ]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const [unread, setUnread]   = useState(0);
  const bottomRef             = useRef(null);
  const inputRef              = useRef(null);

  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = useCallback(async (text) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      const reply = data.reply ?? 'Bağışlayın, bir xəta baş verdi.';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      if (!open) setUnread(u => u + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: '⚠️ Bağlantı xətası baş verdi. Zəhmət olmasa yenidən cəhd edin.',
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, open]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* ── Üzən düymə ──────────────────────────────────── */}
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="AI Assistant"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-brand-blue to-brand-green shadow-2xl shadow-brand-blue/40 flex items-center justify-center text-2xl transition-all hover:scale-110 active:scale-95"
        style={{ boxShadow: '0 0 0 0 rgba(0,102,255,0.4)', animation: 'pulse-ring 2s infinite' }}
      >
        {open ? '✕' : '🤖'}
        {unread > 0 && !open && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-black flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* ── Chat pəncərəsi ───────────────────────────────── */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-24px)] rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl shadow-black/30 flex flex-col overflow-hidden"
          style={{ height: '520px' }}>

          {/* Header */}
          <div className="px-4 py-3 bg-gradient-to-r from-brand-blue to-brand-green flex items-center gap-3 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center text-lg">🤖</div>
            <div>
              <p className="font-bold text-white text-sm">BacarBot</p>
              <p className="text-white/70 text-[10px] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-green-300 inline-block" />
                Aktiv — Gemini AI ilə gücləndirilmiş
              </p>
            </div>
            <button onClick={() => setOpen(false)} className="ml-auto text-white/60 hover:text-white transition-colors text-lg">✕</button>
          </div>

          {/* Mesajlar */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-xs mr-2 mt-1 shrink-0">🤖</div>
                )}
                <div
                  className={`max-w-[80%] px-3 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-blue text-white rounded-tr-sm'
                      : 'bg-[var(--bg-primary)] border border-[var(--border-color)] text-[var(--text-primary)] rounded-tl-sm'
                  }`}
                >
                  <MarkdownText text={msg.content} />
                </div>
              </div>
            ))}

            {/* Loading */}
            {loading && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-brand-blue to-brand-green flex items-center justify-center text-xs mr-2 shrink-0">🤖</div>
                <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] px-4 py-2.5 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1 items-center h-4">
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 rounded-full bg-brand-blue animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Sürətli suallar */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5 shrink-0">
              {QUICK_QUESTIONS.map(q => (
                <button
                  key={q}
                  onClick={() => sendMessage(q)}
                  className="px-2.5 py-1 rounded-lg bg-brand-blue/10 border border-brand-blue/20 text-brand-blue text-[11px] font-medium hover:bg-brand-blue/20 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-[var(--border-color)] flex gap-2 shrink-0">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Sualınızı yazın..."
              rows={1}
              disabled={loading}
              className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-blue/50 resize-none transition-colors disabled:opacity-50"
              style={{ minHeight: '38px', maxHeight: '80px' }}
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-10 h-10 rounded-xl bg-brand-blue text-white flex items-center justify-center hover:bg-brand-blue/90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? (
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                  <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
                </svg>
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="px-4 py-1.5 border-t border-[var(--border-color)] shrink-0">
            <p className="text-center text-[10px] text-[var(--text-muted)]">
              Bacar.az · Gemini AI ilə işləyir
            </p>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(0,102,255,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(0,102,255,0); }
          100% { box-shadow: 0 0 0 0 rgba(0,102,255,0); }
        }
      `}</style>
    </>
  );
}
