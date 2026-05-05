/* ============================================
   Bacar.az — Navbar Bileşeni
   ============================================ */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { signOut, useSession } from 'next-auth/react';
import ThemeToggle from './ThemeToggle';
import Button from '@/components/ui/Button';

const navLinks = [
  { href: '/', label: 'Ana' },
  { href: '/bacar', label: 'BACAR' },
  { href: '/ortaq', label: 'ORTAQ' },
  { href: '/rehber', label: 'RƏHBƏR' },
  { href: '/layihe', label: 'LAYİHƏ' },
  { href: '/vizit', label: 'VİZİT' },
];

const isActive = (pathname, href) => (href === '/' ? pathname === '/' : pathname.startsWith(href));

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();

  useEffect(() => setMobileOpen(false), [pathname]);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="gradient-text-blue">BACAR</span>
          <span className="text-white">.</span>
          <span className="gradient-text-green">AZ</span>
        </Link>

        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? 'font-bold text-white' : 'font-medium text-slate-300 hover:text-[#0066FF]'
                }`}
              >
                {link.label}
                {active && <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-[#00C853]" />}
              </Link>
            );
          })}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {session?.user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Panel</Button>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-slate-300 transition-colors hover:text-red-400"
              >
                Çıxış
              </button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">Daxil ol</Button>
            </Link>
          )}
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white"
            aria-label="Menyu"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-2 rounded-2xl border border-white/10 bg-black/90 p-3 backdrop-blur-xl md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  isActive(pathname, link.href)
                    ? 'font-bold text-white'
                    : 'font-medium text-slate-300 hover:text-[#0066FF]'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}