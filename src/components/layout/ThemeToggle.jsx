/* ============================================
   Bacar.az — Theme Toggle Bileşeni
   ============================================ */
'use client';

import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      onClick={toggleTheme}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl
        bg-[var(--bg-card)] border border-[var(--border-color)]
        hover:border-brand-blue/50 transition-all duration-200"
      aria-label="Tema dəyiş"
      title={theme === 'dark' ? 'Açıq tema' : 'Qaranlıq tema'}
    >
      <motion.span
        key={theme}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        exit={{ rotate: 90, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="text-lg"
      >
        {theme === 'dark' ? '☀️' : '🌙'}
      </motion.span>
    </motion.button>
  );
}
