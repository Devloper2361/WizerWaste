import React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  size = 'sm',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 rounded',
    md: 'text-xs px-2.5 py-1 rounded-md'
  }[size];

  const variantClasses = {
    neutral: 'bg-stone-100 text-stone-700 border border-stone-200 font-medium',
    success: 'bg-emerald-50 text-emerald-800 border border-emerald-200/80 font-medium',
    warning: 'bg-amber-50 text-amber-900 border border-amber-200 font-medium',
    danger: 'bg-rose-50 text-rose-800 border border-rose-200 font-medium',
    info: 'bg-sky-50 text-sky-800 border border-sky-200 font-medium'
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 leading-none whitespace-nowrap shrink-0 ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
