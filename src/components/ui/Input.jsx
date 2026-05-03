/* ============================================
   Bacar.az — Input Bileşeni
   ============================================ */
'use client';

import { cn } from '@/lib/utils';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className = '',
  icon = null,
  textarea = false,
  rows = 4,
  id,
  ...props
}) {
  const inputId = id || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`;

  const baseClasses = cn(
    'w-full px-4 py-3 rounded-xl',
    'bg-[var(--bg-card)] border border-[var(--border-color)]',
    'text-[var(--text-primary)] placeholder:text-[var(--text-muted)]',
    'input-focus transition-all duration-200',
    'font-inter text-sm',
    error && 'border-red-500 focus:border-red-500 focus:shadow-red-500/15',
    icon && 'pl-11',
    className
  );

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-[var(--text-secondary)]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]">
            {icon}
          </span>
        )}
        {textarea ? (
          <textarea
            id={inputId}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className={cn(baseClasses, 'resize-none')}
            {...props}
          />
        ) : (
          <input
            id={inputId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className={baseClasses}
            {...props}
          />
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
