/* ============================================
   Bacar.az — CTA Section (Landing)
   ============================================ */
'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CTASection() {
  return (
    <section className="py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Arka Plan */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-blue-600 to-brand-green opacity-90" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30" />

          {/* İçerik */}
          <div className="relative z-10 text-center py-16 px-6 sm:px-12">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6"
            >
              Özünü sınayın —<br />
              <span className="text-brand-gold">Qeydiyyat pulsuzdur</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-white/80 max-w-xl mx-auto mb-10 leading-relaxed"
            >
              İstər freelancer ol, istər müştəri — Bacar.az sənin peşəkar inkişafın
              üçün lazım olan hər şeyi bir yerdə toplayır.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth">
                <Button
                  variant="gold"
                  size="xl"
                  icon="⚡"
                  className="shadow-2xl shadow-yellow-500/30"
                >
                  Pulsuz qeydiyyatdan keç
                </Button>
              </Link>
              <Link href="/vizit">
                <Button
                  variant="ghost"
                  size="xl"
                  className="text-white border-2 border-white/20 hover:bg-white/10 hover:text-white"
                >
                  Portfolio yarat →
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
