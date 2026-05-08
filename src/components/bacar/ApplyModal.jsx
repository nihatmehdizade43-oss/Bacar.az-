/* ============================================================
   Bacar.az — ApplyModal
   Müraciət göndərildikdə:
   1. /api/applications POST — müraciəti saxla
   2. /api/conversations POST — söhbət yarat (müraciətçi ↔ elan sahibi)
   3. /api/messages POST — ilk mesajı göndər (müraciət məzmunu)
   4. Hər iki tərəfə bildiriş avtomatik yaranır (server tərəfindən)
   ============================================================ */
'use client';
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/Modal';
import Button from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

export default function ApplyModal({ isOpen, onClose, job }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { addToast } = useToast();

  const [step, setStep] = useState(1); // 1: form, 2: uğurlu
  const [price, setPrice] = useState('');
  const [message, setMessage] = useState('');
  const [timeline, setTimeline] = useState('');
  const [loading, setLoading] = useState(false);

  const isAuthed = status === 'authenticated';

  /* ── Formu sıfırla ──────────────────────────────────────── */
  function reset() {
    setStep(1);
    setPrice('');
    setMessage('');
    setTimeline('');
    setLoading(false);
  }

  function handleClose() {
    reset();
    onClose();
  }

  /* ── Göndər ─────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    if (!isAuthed) {
      router.push('/login');
      return;
    }
    if (!price || !message) {
      addToast('Qiymət və mesajı doldurun', 'warning');
      return;
    }

    setLoading(true);
    try {
      /* 1 — Müraciəti saxla */
      const appRes = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId: job?.id,
          jobTitle: job?.title,
          posterUserId: job?.userId,
          offeredPrice: Number(price),
          timeline,
          message,
        }),
      });

      if (!appRes.ok) {
        const err = await appRes.json().catch(() => ({}));
        throw new Error(err.error || 'Müraciət göndərilmədi');
      }

      /* 2 — Söhbət yarat (elan sahibi ilə) */
      if (job?.userId && job.userId !== session?.user?.id) {
        const convRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ otherUserId: job.userId }),
        });
        const convData = await convRes.json().catch(() => null);
        const convId = convData?.id;

        /* 3 — İlk mesajı göndər */
        if (convId) {
          const intro = `📋 **${job.title}** elanına müraciət\n\n${message}\n\n💰 Təklif etdiyim qiymət: ${price} ₼${timeline ? `\n⏱️ İcra müddəti: ${timeline}` : ''}`;
          await fetch('/api/messages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ conversationId: convId, content: intro }),
          });
        }
      }

      setStep(2);
    } catch (err) {
      addToast(err.message || 'Xəta baş verdi', 'error');
    } finally {
      setLoading(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────── */
  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={step === 2 ? '✅ Müraciət Göndərildi' : '📩 Müraciət Et'} size="md">

      {/* ── UĞURLU EKRAN ────────────────────────────────────── */}
      {step === 2 ? (
        <div className="flex flex-col items-center gap-5 py-6 text-center">
          <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center text-4xl animate-bounce-once">
            ✅
          </div>
          <div>
            <h3 className="text-xl font-black text-[var(--text-primary)] mb-1">Müraciətiniz göndərildi!</h3>
            <p className="text-sm text-[var(--text-secondary)]">
              Elan sahibi ilə avtomatik söhbət açıldı. Mesajlar bölməsindən izləyə bilərsiniz.
            </p>
          </div>
          <div className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-primary)] p-4 text-sm text-left space-y-2">
            <p className="font-semibold text-[var(--text-primary)]">📋 {job?.title}</p>
            <p className="text-[var(--text-muted)]">Elan sahibi: <span className="text-[var(--text-secondary)]">{job?.posterName}</span></p>
            <p className="text-[var(--text-muted)]">Təklif: <span className="font-bold text-brand-green">{price} ₼</span></p>
          </div>
          <div className="flex gap-3 w-full">
            <Button variant="ghost" onClick={handleClose} className="flex-1">Bağla</Button>
            <Button
              variant="primary"
              onClick={() => { handleClose(); router.push('/mesajlar'); }}
              className="flex-1"
            >
              💬 Mesajlara keç
            </Button>
          </div>
        </div>

      ) : (
        /* ── FORM ─────────────────────────────────────────── */
        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Elan məlumatı */}
          <div className="p-3 rounded-xl bg-brand-blue/5 border border-brand-blue/10">
            <p className="text-sm font-semibold text-[var(--text-primary)] line-clamp-1">{job?.title}</p>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">
              Elan sahibi: {job?.posterName}
              {job?.budgetMax > 0 && (
                <span className="ml-2 text-brand-green font-semibold">• Büdcə: {job.budgetMax} ₼</span>
              )}
            </p>
          </div>

          {/* Qiymət */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              💰 Təklif etdiyiniz qiymət (₼) <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="number"
                min="1"
                value={price}
                onChange={e => setPrice(e.target.value)}
                placeholder="500"
                required
                className="w-full px-4 py-2.5 pr-10 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-blue/50 transition-colors"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] text-sm">₼</span>
            </div>
            {/* Sürətli qiymət seçimi */}
            <div className="flex gap-1.5 mt-2">
              {[100, 250, 500, 1000].map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setPrice(String(v))}
                  className={`flex-1 py-1 rounded-lg text-xs font-semibold border transition-all ${
                    price === String(v)
                      ? 'bg-brand-blue text-white border-brand-blue'
                      : 'border-[var(--border-color)] text-[var(--text-muted)] hover:border-brand-blue/50'
                  }`}
                >
                  {v}₼
                </button>
              ))}
            </div>
          </div>

          {/* İcra müddəti */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              ⏱️ İcra müddəti
            </label>
            <select
              value={timeline}
              onChange={e => setTimeline(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-brand-blue/50 transition-colors"
            >
              <option value="">Seçin (istəyə görə)</option>
              <option value="1-3 gün">1-3 gün</option>
              <option value="1 həftə">1 həftə</option>
              <option value="2 həftə">2 həftə</option>
              <option value="1 ay">1 ay</option>
              <option value="1-3 ay">1-3 ay</option>
              <option value="Razılaşmaya görə">Razılaşmaya görə</option>
            </select>
          </div>

          {/* Mesaj */}
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
              ✍️ Özünüzü tanıdın <span className="text-red-400">*</span>
            </label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Bu iş üçün niyə uyğunsunuz? Təcrübənizi, bacarıqlarınızı qısaca yazın..."
              required
              rows={4}
              maxLength={800}
              className="w-full px-4 py-2.5 rounded-xl bg-[var(--bg-primary)] border border-[var(--border-color)] text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-brand-blue/50 transition-colors resize-none"
            />
            <p className="text-right text-xs text-[var(--text-muted)] mt-1">{message.length}/800</p>
          </div>

          {/* Anti-bypass xəbərdarlığı */}
          <div className="flex items-start gap-2 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
            <span className="text-amber-400 mt-0.5 shrink-0">⚠️</span>
            <p className="text-xs text-amber-300/90">
              Telefon nömrəsi, email və ya xarici əlaqə paylaşmaq qadağandır. Bütün ünsiyyət platforma daxilindən aparılmalıdır.
            </p>
          </div>

          {/* Düymələr */}
          <div className="flex gap-3 pt-1">
            <Button type="button" variant="ghost" onClick={handleClose} className="flex-1">
              Ləğv et
            </Button>
            <Button
              type="submit"
              variant="success"
              loading={loading}
              disabled={!isAuthed || loading}
              className="flex-1"
            >
              {!isAuthed ? '🔐 Daxil ol' : '📨 Müraciət Göndər'}
            </Button>
          </div>

          {!isAuthed && (
            <p className="text-center text-xs text-[var(--text-muted)]">
              Müraciət etmək üçün{' '}
              <button type="button" onClick={() => router.push('/login')} className="text-brand-blue hover:underline">
                daxil olun
              </button>
            </p>
          )}
        </form>
      )}
    </Modal>
  );
}