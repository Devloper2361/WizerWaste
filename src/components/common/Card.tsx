import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  headerAction?: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  headerAction,
  title,
  subtitle,
  className = '',
  padding = 'md',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3.5',
    md: 'p-5',
    lg: 'p-6'
  }[padding];

  return (
    <div
      className={`bg-white border border-stone-200 rounded-lg shadow-[0_1px_2px_rgba(0,0,0,0.04)] ${paddingClasses} ${className}`}
      {...props}
    >
      {(title || subtitle || headerAction) && (
        <div className="flex items-start justify-between gap-4 mb-4 pb-3 border-b border-stone-100">
          <div>
            {title && (
              <h3 className="text-sm font-semibold text-stone-900 tracking-tight">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          {headerAction && <div className="shrink-0">{headerAction}</div>}
        </div>
      )}
      {children}
    </div>
  );
};
