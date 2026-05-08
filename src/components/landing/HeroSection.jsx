/* ============================================================
   Bacar.az — Hero Section
   • Daxil olmamış: "Özünü sına" CTA
   • Daxil olmuş: şəxsi salamlama + sürətli keçid kartları
   ============================================================ */
'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTypewriter } from '@/hooks/useTypewriter';
import Button from '@/components/ui/Button';

const QUICK_LINKS = [
  { href: '/bacar',     icon: '💼', label: 'İş Elanları',   color: 'from-blue-600 to-blue-800'   },
  { href: '/vizit',     icon: '✨', label: 'Portfoliom',    color: 'from-purple-600 to-purple-800'},
  { href: '/mesajlar',  icon: '💬', label: 'Mesajlar',      color: 'from-green-600 to-green-800'  },
  { href: '/dashboard', icon: '👤', label: 'Profilim',      color: 'from-amber-600 to-amber-800'  },
];

export default function HeroSection() {
  const { data: session, status } = useSession();
  const isLoggedIn = status === 'authenticated';

  const { text, isComplete } = useTypewriter(
    ['Bacar. Tap. Böyü.'],
    120, 80, 800
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#063063] to-[#00C853]" />

      {/* Animated dots */}
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
          backgroundSize: '48px 48px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center w-full">

        {/* ── Daxil OLMAMIŞSA ─────────────────────────────── */}
        {!isLoggedIn ? (
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-8 fade-in-up">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-sm font-medium text-brand-blue">Açıq Beta — v1.0</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 fade-in-up animate-delay-100">
              <span className="gradient-text-multi">{text}</span>
              {!isComplete && (
                <span className="inline-block w-1 h-12 sm:h-16 md:h-20 bg-brand-blue ml-1 animate-pulse" />
              )}
            </h1>

            <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up animate-delay-200">
              Azərbaycanın ilk gənc rəqəmsal ekosistemi. Bacarığını göstər, iş tap,
              peşəkar şəbəkəni genişləndir.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up animate-delay-300">
              <Link href="/register">
                <Button variant="gradient" size="xl">
                  🚀 Pulsuz başla
                </Button>
              </Link>
              <Link href="/bacar">
                <Button variant="ghost" size="xl" className="text-white border-white/20 hover:bg-white/10 hover:text-white border-2">
                  İş elanlarına bax →
                </Button>
              </Link>
            </div>

            <div className="mt-16 flex items-center justify-center gap-6 text-sm text-[var(--text-muted)] fade-in-up animate-delay-400">
              <span>✓ Pulsuz qeydiyyat</span>
              <span className="hidden sm:block">•</span>
              <span className="hidden sm:block">✓ AI dəstəyi</span>
              <span className="hidden sm:block">•</span>
              <span className="hidden sm:block">✓ 2 dəqiqədə başla</span>
            </div>
          </>
        ) : (
          /* ── Daxil OLMUŞSA ────────────────────────────── */
          <>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 mb-6 fade-in-up">
              <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
              <span className="text-sm font-medium text-brand-green">Xoş gəldin, {session.user?.name?.split(' ')[0]}! 👋</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white mb-4 fade-in-up animate-delay-100">
              Platformana Xoş Gəldin
            </h1>
            <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 fade-in-up animate-delay-200">
              Bacar.az-da bacarığını göstər, iş tap, böyü.
            </p>

            {/* Sürətli keçid kartları */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto fade-in-up animate-delay-300">
              {QUICK_LINKS.map(link => (
                <Link key={link.href} href={link.href}
                  className={`rounded-2xl p-4 bg-gradient-to-br ${link.color} text-white font-semibold text-sm hover:scale-105 active:scale-95 transition-all shadow-lg`}>
                  <span className="text-2xl block mb-1">{link.icon}</span>
                  {link.label}
                </Link>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
}
