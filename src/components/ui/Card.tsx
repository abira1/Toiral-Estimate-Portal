import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
interface CardProps extends HTMLMotionProps<'div'> {
  hoverable?: boolean;
  children: React.ReactNode;
}
export function Card({
  children,
  className = '',
  hoverable = false,
  ...props
}: CardProps) {
  return (
    <motion.div
      initial={
      hoverable ?
      {
        y: 0
      } :
      undefined
      }
      whileHover={
      hoverable ?
      {
        y: -4,
        boxShadow: '0 10px 30px -5px rgba(22, 56, 75, 0.15)'
      } :
      undefined
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20
      }}
      className={`bg-toiral-bg-light rounded-3xl shadow-soft p-6 border border-white/50 ${className}`}
      {...props}>

      {children}
    </motion.div>);

}