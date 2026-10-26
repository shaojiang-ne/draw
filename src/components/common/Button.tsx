import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
}

const variantClasses: Record<string, string> = {
  primary: 'bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]',
  secondary: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] hover:bg-[var(--color-border)]',
  ghost: 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-tertiary)]',
  danger: 'bg-[var(--color-error)] text-white hover:opacity-90',
};

const sizeClasses: Record<string, string> = {
  sm: 'px-2 py-1 text-xs gap-1',
  md: 'px-3 py-1.5 text-sm gap-1.5',
  lg: 'px-4 py-2 text-base gap-2',
};

export function Button({ variant = 'primary', size = 'md', loading, icon, children, disabled, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} /> : icon}
      {children}
    </button>
  );
}
