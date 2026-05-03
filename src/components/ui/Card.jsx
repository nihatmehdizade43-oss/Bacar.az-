/* ============================================
   Bacar.az — Card Bileşeni
   ============================================ */
'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function Card({
  children,
  className = '',
  hover = true,
  glow = false,
  glowColor = 'blue',
  padding = true,
  onClick,
  ...props
}) {
  const glowColors = {
    blue: 'hover:shadow-blue-500/20',
    green: 'hover:shadow-green-500/20',
    gold: 'hover:shadow-yellow-500/20',
    purple: 'hover:shadow-purple-500/20',
    pink: 'hover:shadow-pink-500/20',
    orange: 'hover:shadow-orange-500/20',
  };

  return (
    <motion.div
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5 }}
      whileHover={hover ? { y: -6, transition: { duration: 0.2 } } : {}}
      className={cn(
        'bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl',
        'transition-all duration-300',
        padding && 'p-6',
        hover && 'cursor-pointer hover:shadow-xl',
        glow && glowColors[glowColor],
        glow && 'hover:border-opacity-50',
        onClick && 'cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
