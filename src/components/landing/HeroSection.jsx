/* ============================================
   Bacar.az — Hero Section
   ============================================ */
'use client';

import Link from 'next/link';
import { useTypewriter } from '@/hooks/useTypewriter';
import Button from '@/components/ui/Button';

export default function HeroSection() {
  const { text, isComplete } = useTypewriter(
    ['Bacar.', 'Tap.', 'Böyü.'],
    120,
    80,
    800
  );

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0A0A0A] via-[#063063] to-[#00C853]" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Beta Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-blue/10 border border-brand-blue/20 mb-8 fade-in-up">
          <span className="w-2 h-2 rounded-full bg-brand-green animate-pulse" />
          <span className="text-sm font-medium text-brand-blue">Açıq Beta — v1.0</span>
        </div>

        {/* Typewriter Başlık */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black leading-tight mb-6 fade-in-up animate-delay-100">
          <span className="gradient-text-multi">{text}</span>
          {!isComplete && (
            <span className="inline-block w-1 h-12 sm:h-16 md:h-20 bg-brand-blue ml-1 animate-pulse" />
          )}
        </h1>

        {/* Alt Metin */}
        <p className="text-lg sm:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed fade-in-up animate-delay-200">
          Azərbaycanın ilk gənc rəqəmsal ekosistemi. Bacarığını göstər, iş tap,
          peşəkar şəbəkəni genişləndir.
        </p>

        {/* CTA Butonlar */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 fade-in-up animate-delay-300">
          <Link href="/vizit">
            <Button variant="success" size="lg" icon="🎯">
              Portfolionu yarat — 2 dəqiqə
            </Button>
          </Link>
          <Link href="/bacar">
            <Button variant="primary" size="lg" icon="💼">
              İş elanı ver
            </Button>
          </Link>
          <Link href="/auth">
            <Button variant="gold" size="lg" icon="⚡">
              Qeydiyyat pulsuzdur
            </Button>
          </Link>
        </div>

        {/* Alt İstatistik */}
        <div className="mt-16 flex items-center justify-center gap-8 text-sm text-[var(--text-muted)] fade-in-up animate-delay-400">
          <span>✓ Pulsuz qeydiyyat</span>
          <span className="hidden sm:block">•</span>
          <span className="hidden sm:block">✓ AI dəstəyi</span>
          <span className="hidden sm:block">•</span>
          <span className="hidden sm:block">✓ 2 dəqiqədə başla</span>
        </div>
      </div>

      {/* Alt Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </section>
  );
}
