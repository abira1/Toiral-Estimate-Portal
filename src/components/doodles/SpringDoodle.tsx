import React from 'react';
import { motion } from 'framer-motion';
interface DoodleProps {
  className?: string;
  color?: string;
  size?: number;
}
export function SpringDoodle({
  className = '',
  color = '#BBDAD9',
  size = 32
}: DoodleProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      animate={{
        y: [0, -5, 0]
      }}
      transition={{
        repeat: Infinity,
        duration: 2,
        ease: 'easeInOut'
      }}>

      <path
        d="M12 22C12 22 4 18 4 12C4 6 12 2 12 2C12 2 20 6 20 12C20 18 12 22 12 22Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="4 4" />

      <circle cx="12" cy="12" r="3" fill={color} />
    </motion.svg>);

}