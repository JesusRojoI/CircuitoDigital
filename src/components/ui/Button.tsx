'use client';

import React from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'outline' | 'ghost' | 'dark';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: string;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    'text-white bg-gradient-to-r from-primary-500 to-pink-500 shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50',
  outline:
    'text-primary-600 border-2 border-primary-500 bg-transparent hover:bg-primary-50',
  ghost:
    'text-ink-soft bg-transparent hover:bg-primary-50 hover:text-primary-600',
  dark:
    'text-white bg-ink hover:bg-ink-soft shadow-lg shadow-ink/20',
};

const SIZES: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-sm',
  lg: 'px-8 py-4 text-base',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  className,
  disabled,
  ...rest
}: ButtonProps) {
  return (
    <button
      {...rest}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-medium',
        'transition-all duration-300 ease-out',
        'hover:-translate-y-0.5 active:translate-y-0',
        'disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {loading ? (
        <>
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          <span>{children}</span>
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && <i className={cn('bi', icon)} />}
          {children}
          {icon && iconPosition === 'right' && <i className={cn('bi', icon)} />}
        </>
      )}
    </button>
  );
}