import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}
export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-full font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-toiral-primary disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-toiral-primary text-white hover:bg-toiral-dark shadow-soft',
    secondary: 'bg-toiral-dark text-white hover:bg-toiral-primary shadow-soft',
    outline:
    'border-2 border-toiral-primary text-toiral-primary hover:bg-toiral-bg-light',
    ghost: 'text-toiral-dark hover:bg-toiral-light/20'
  };
  const sizes = {
    sm: 'h-9 px-4 text-sm',
    md: 'h-11 px-6 text-base',
    lg: 'h-14 px-8 text-lg'
  };
  return (
    <motion.button
      whileHover={{
        scale: disabled || loading ? 1 : 1.02
      }}
      whileTap={{
        scale: disabled || loading ? 1 : 0.98
      }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      {...props}>

      {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </motion.button>);

}