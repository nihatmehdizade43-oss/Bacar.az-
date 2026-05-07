/* ============================================
   Bacar.az — Navbar with Notification Bell
   ============================================ */
'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
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
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();
  const bellRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMobileOpen(false), [pathname]);

  const fetchNotifications = useCallback(async () => {
    if (!session?.user) return;
    try {
      const res = await fetch('/api/notifications');
      const json = await res.json();
      if (json.success) {
        setNotifications(json.data);
        setUnreadCount(json.unreadCount);
      }
    } catch {}
  }, [session?.user]);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Close notif panel on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: 'PATCH' });
    fetchNotifications();
  }

  async function markAllRead() {
    await fetch('/api/notifications/all-read', { method: 'PUT' });
    fetchNotifications();
    setNotifOpen(false);
  }

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/80 py-3 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="text-2xl font-black tracking-tight">
          <span className="gradient-text-blue">BACAR</span>
          <span className="text-white">.</span>
          <span className="gradient-text-green">AZ</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link key={link.href} href={link.href}
                className={`relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  active ? 'font-bold text-white' : 'font-medium text-slate-300 hover:text-[#0066FF]'
                }`}>
                {link.label}
                {active && <span className="absolute inset-x-2 -bottom-1 h-0.5 rounded-full bg-[#00C853]" />}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          {session?.user ? (
            <>
              {/* Notification Bell */}
              <div ref={bellRef} className="relative">
                <button onClick={() => setNotifOpen((v) => !v)}
                  className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-all"
                  aria-label="Bildirişlər">
                  🔔
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div initial={{ opacity: 0, y: 8, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }} transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 w-80 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-card)] shadow-2xl overflow-hidden z-50">
                      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
                        <h3 className="font-bold text-sm text-[var(--text-primary)]">🔔 Bildirişlər</h3>
                        {unreadCount > 0 && (
                          <button onClick={markAllRead} className="text-xs text-brand-blue hover:underline">
                            Hamısını oxu
                          </button>
                        )}
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-[var(--text-muted)]">
                            <div className="text-2xl mb-1">🔕</div>
                            Bildiriş yoxdur
                          </div>
                        ) : (
                          notifications.map((n) => (
                            <button key={n.id} onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link; }}
                              className={`w-full text-left px-4 py-3 border-b border-[var(--border-color)] hover:bg-[var(--bg-card-hover)] transition-colors ${
                                !n.readAt ? 'bg-brand-blue/5' : ''
                              }`}>
                              <div className="flex items-start gap-2">
                                {!n.readAt && <span className="w-2 h-2 rounded-full bg-brand-blue mt-1.5 flex-shrink-0" />}
                                <div className={!n.readAt ? '' : 'pl-4'}>
                                  <p className="text-xs font-semibold text-[var(--text-primary)]">{n.title}</p>
                                  <p className="text-xs text-[var(--text-secondary)] mt-0.5 line-clamp-2">{n.body}</p>
                                  <p className="text-xs text-[var(--text-muted)] mt-1">
                                    {new Date(n.createdAt).toLocaleDateString('az-AZ')}
                                  </p>
                                </div>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mesajlar */}
              <Link href="/mesajlar"
                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${
                  isActive(pathname, '/mesajlar') ? 'text-white' : 'text-slate-300 hover:text-[#0066FF]'
                }`}>
                💬 Mesajlar
              </Link>

              <Link href="/dashboard">
                <Button variant="ghost" size="sm">Panel</Button>
              </Link>
              <button onClick={() => signOut({ callbackUrl: '/' })}
                className="text-sm text-slate-300 transition-colors hover:text-red-400">
                Çıxış
              </button>
            </>
          ) : (
            <Link href="/login">
              <Button variant="primary" size="sm">Daxil ol</Button>
            </Link>
          )}
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          {session?.user && unreadCount > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
          <button onClick={() => setMobileOpen((prev) => !prev)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white"
            aria-label="Menyu">
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-4 mt-2 rounded-2xl border border-white/10 bg-black/90 p-3 backdrop-blur-xl md:hidden">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className={`block rounded-lg px-3 py-2 text-sm ${
                  isActive(pathname, link.href) ? 'font-bold text-white' : 'font-medium text-slate-300 hover:text-[#0066FF]'
                }`}>
                {link.label}
              </Link>
            ))}
            {session?.user && (
              <>
                <Link href="/mesajlar" className={`block rounded-lg px-3 py-2 text-sm ${
                  isActive(pathname, '/mesajlar') ? 'font-bold text-white' : 'font-medium text-slate-300 hover:text-[#0066FF]'
                }`}>💬 Mesajlar</Link>
                <Link href="/dashboard" className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-300 hover:text-[#0066FF]">
                  📊 Panel
                </Link>
                <button onClick={() => signOut({ callbackUrl: '/' })}
                  className="block w-full text-left rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:text-red-300">
                  ← Çıxış
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}