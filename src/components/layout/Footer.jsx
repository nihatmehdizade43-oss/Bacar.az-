/* ============================================
   Bacar.az — Footer Bileşeni
   ============================================ */
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState } from 'react';

const footerLinks = {
  'Platforma': [
    { label: 'Vizit — AI Portfolio', href: '/vizit' },
    { label: 'İşlər — Freelance', href: '/isler' },
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Mesajlarım', href: '/mesajlar' },
  ],
  'Tezliklə': [
    { label: 'Ortaq — Networking', href: '/ortaq' },
    { label: 'Rəhbər — Mentorluq', href: '/rehber' },
    { label: 'Layihə — Marketplace', href: '/layihe' },
    { label: 'Yarış — Challenge', href: '#' },
  ],
  'Dəstək': [
    { label: '📧 nihatmehdizade43@gmail.com', href: 'mailto:nihatmehdizade43@gmail.com' },
    { label: '📞 +994 55 322 91 66', href: 'tel:+994553229166' },
    { label: '💬 WhatsApp Dəstək', href: 'https://wa.me/994553229166' },
    { label: '🔒 Gizlilik Siyasəti', href: '/gizlilik' },
  ],
};


export default function Footer() {
  const router = useRouter();
  const [clickCount, setClickCount] = useState(0);
  const [lastClick, setLastClick] = useState(0);

  const handleClick = () => {
    const now = Date.now();
    if (now - lastClick < 2000) {
      const newCount = clickCount + 1;
      setClickCount(newCount);
      if (newCount === 3) {
        router.push('/admin');
        setClickCount(0);
      }
    } else {
      setClickCount(1);
    }
    setLastClick(now);
  };

  return (
    <footer className="border-t border-[var(--border-color)] bg-[var(--bg-card)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Üst Hissə */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Açıklama */}
          <div className="md:col-span-1">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-black tracking-tight">
                <span className="gradient-text-blue">BACAR</span>
                <span className="text-[var(--text-primary)]">.</span>
                <span className="gradient-text-green">AZ</span>
              </span>
            </Link>
            <p className="mt-3 text-sm text-[var(--text-secondary)] leading-relaxed">
              Azərbaycanın ilk gənc rəqəmsal ekosistemi. Bacarığını göstər, iş tap, böyü.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-lg bg-[var(--bg-card-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand-blue transition-colors"
              >
                𝕏
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-lg bg-[var(--bg-card-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand-blue transition-colors"
              >
                📸
              </motion.a>
              <motion.a
                href="#"
                whileHover={{ scale: 1.1 }}
                className="w-9 h-9 rounded-lg bg-[var(--bg-card-hover)] flex items-center justify-center text-[var(--text-muted)] hover:text-brand-blue transition-colors"
              >
                💼
              </motion.a>
            </div>
          </div>

          {/* Link Sütunları */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-bold text-[var(--text-primary)] mb-4">{title}</h4>
              <ul className="space-y-2">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[var(--text-secondary)] hover:text-brand-blue transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Alt Hissə */}
        <div className="py-6 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4">
          <p 
            className="text-xs text-[var(--text-muted)] cursor-pointer select-none hover:opacity-70 transition-opacity"
            onClick={handleClick}
          >
            © 2026 BACAR.AZ — Bütün hüquqlar qorunur.
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            🇦🇿 Azərbaycanda ❤️ ilə hazırlandı
          </p>
        </div>
      </div>
    </footer>
  );
}