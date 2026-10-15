import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-all select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-800/30 disabled:opacity-50 disabled:pointer-events-none cursor-pointer whitespace-nowrap shrink-0';

  const sizeClasses = {
    sm: 'text-xs px-2.5 py-1.5 rounded-md gap-1.5',
    md: 'text-xs px-3.5 py-2 rounded-lg gap-2',
    lg: 'text-sm px-4.5 py-2.5 rounded-lg gap-2.5'
  }[size];

  const variantClasses = {
    primary:
      'bg-emerald-800 text-white font-medium hover:bg-emerald-900 active:bg-emerald-950 shadow-xs',
    secondary:
      'bg-white text-stone-700 hover:bg-stone-50 hover:text-stone-900 border border-stone-200 shadow-xs',
    outline:
      'bg-transparent text-stone-700 hover:text-stone-900 hover:bg-stone-100/70 border border-stone-300',
    ghost:
      'bg-transparent text-stone-600 hover:text-stone-900 hover:bg-stone-100',
    danger:
      'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
  }[variant];

  return (
    <button
      className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
};
