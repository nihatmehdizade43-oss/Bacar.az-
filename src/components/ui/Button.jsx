/* ============================================
   Bacar.az — Button Bileşeni
   ============================================ */
'use client';

import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-brand-blue hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25',
  success: 'bg-brand-green hover:bg-green-700 text-white shadow-lg shadow-green-500/25',
  gold: 'bg-brand-gold hover:bg-yellow-600 text-gray-900 shadow-lg shadow-yellow-500/25',
  outline: 'border-2 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white',
  ghost: 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-card-hover)]',
  danger: 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-500/25',
};

const sizes = {
  sm: 'px-4 py-2 text-sm rounded-lg',
  md: 'px-6 py-3 text-sm rounded-xl',
  lg: 'px-8 py-4 text-base rounded-xl',
  xl: 'px-10 py-5 text-lg rounded-2xl',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  icon = null,
  onClick = () => {},
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(
        'font-inter font-semibold transition-all duration-200 inline-flex items-center justify-center gap-2',
        'hover:scale-[1.02]',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Yüklənir...
        </>
      ) : (
        <>
          {icon && <span>{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
}
