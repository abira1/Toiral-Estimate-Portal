import React from 'react';
interface BadgeProps {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
  className?: string;
}
export function Badge({
  variant = 'info',
  children,
  className = ''
}: BadgeProps) {
  const variants = {
    success: 'bg-green-100 text-green-700 border-green-200',
    warning: 'bg-amber-100 text-amber-700 border-amber-200',
    error: 'bg-red-100 text-red-700 border-red-200',
    info: 'bg-toiral-light/30 text-toiral-primary border-toiral-light',
    neutral: 'bg-gray-100 text-gray-600 border-gray-200'
  };
  return (
    <span
      className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border
      ${variants[variant]}
      ${className}
    `}>

      {children}
    </span>);

}