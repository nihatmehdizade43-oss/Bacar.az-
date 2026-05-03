/* ============================================
   Bacar.az — Badge Bileşeni
   ============================================ */
'use client';

import { cn } from '@/lib/utils';

const colorMap = {
  blue: 'bg-blue-500/10 text-blue-500 dark:text-blue-400',
  green: 'bg-green-500/10 text-green-500 dark:text-green-400',
  gold: 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400',
  red: 'bg-red-500/10 text-red-500 dark:text-red-400',
  purple: 'bg-purple-500/10 text-purple-500 dark:text-purple-400',
  gray: 'bg-gray-500/10 text-gray-500 dark:text-gray-400',
  pink: 'bg-pink-500/10 text-pink-500 dark:text-pink-400',
  orange: 'bg-orange-500/10 text-orange-500 dark:text-orange-400',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-4 py-1.5 text-sm',
};

export default function Badge({
  children,
  color = 'blue',
  size = 'md',
  removable = false,
  onRemove,
  className = '',
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 font-medium rounded-full',
        colorMap[color],
        sizes[size],
        className
      )}
    >
      {children}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-0.5 hover:opacity-70 transition-opacity"
          aria-label="Sil"
        >
          ✕
        </button>
      )}
    </span>
  );
}
