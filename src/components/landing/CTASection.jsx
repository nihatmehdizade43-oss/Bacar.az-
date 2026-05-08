/* ============================================================
   Bacar.az — CTA Section
   • Daxil olmamış: qeydiyyat CTA
   • Daxil olmuş: bölmə keçid linklər (platformanı kəşf et)
   ============================================================ */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import Button from '@/components/ui/Button';

const SECTIONS = [
  { href: '/bacar',   icon: '💼', title: 'Bacar',   desc: 'Freelance iş elanları',    color: '#0066FF' },
  { href: '/vizit',   icon: '✨', title: 'Vizit',   desc: 'AI portfolio generatoru',  color: '#9C27B0' },
  { href: '/mesajlar',icon: '💬', title: 'Mesajlar',desc: 'Daxili kommunikasiya',      color: '#00C853' },
  { href: '/dashboard',icon:'👤', title: 'Profil',  desc: 'Hesabınız & statistika',   color: '#FF6B00' },
];

export default function CTASection() {
  const { status } = useSession();
  const isLoggedIn = status === 'authenticated';

  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-blue-600 to-brand-green opacity-90" />
          <div className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          <div className="relative z-10 text-center py-14 px-6 sm:px-12">
            {!isLoggedIn ? (
              /* ── Qeydiyyatsız ─────────────────────── */
              <>
                <motion.h2
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
                >
                  Pulsuz qeydiyyatdan keç
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="text-lg text-white/80 max-w-xl mx-auto mb-10"
                >
                  İstər freelancer ol, istər müştəri — Bacar.az sənin peşəkar inkişafın
                  üçün lazım olan hər şeyi bir yerdə toplayır.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                  <Link href="/register">
                    <Button variant="gradient" size="xl" className="shadow-2xl shadow-black/25 bg-white text-brand-blue hover:bg-white/90">
                      🚀 İndi başla — Pulsuzdur
                    </Button>
                  </Link>
                  <Link href="/vizit">
                    <Button variant="ghost" size="xl" className="text-white border-2 border-white/20 hover:bg-white/10 hover:text-white">
                      Portfolio yarat →
                    </Button>
                  </Link>
                </motion.div>
              </>
            ) : (
              /* ── Qeydiyyatlı ──────────────────────── */
              <>
                <motion.h2
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  className="text-3xl sm:text-4xl font-black text-white mb-3"
                >
                  Platformanı Kəşf Et
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="text-white/80 mb-10"
                >
                  Bütün bölmələr sənin üçün hazırdır
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto"
                >
                  {SECTIONS.map(sec => (
                    <Link key={sec.href} href={sec.href}
                      className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-2xl p-4 text-left transition-all hover:scale-105 active:scale-95"
                    >
                      <span className="text-2xl block mb-2">{sec.icon}</span>
                      <p className="font-bold text-white text-sm">{sec.title}</p>
                      <p className="text-white/60 text-[11px] mt-0.5">{sec.desc}</p>
                    </Link>
                  ))}
                </motion.div>
              </>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
