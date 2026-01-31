import React from 'react';
import { motion } from 'framer-motion';
interface DoodleProps {
  className?: string;
  color?: string;
  width?: number;
}
export function ScribbleDoodle({
  className = '',
  color = '#149499',
  width = 100
}: DoodleProps) {
  return (
    <motion.svg
      width={width}
      height={width * 0.2}
      viewBox="0 0 100 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      initial={{
        pathLength: 0,
        opacity: 0
      }}
      animate={{
        pathLength: 1,
        opacity: 1
      }}
      transition={{
        duration: 1.5,
        ease: 'easeInOut'
      }}>

      <path
        d="M2 10C15 2 25 18 40 10C55 2 65 18 80 10C90 5 98 15 98 15"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round" />

    </motion.svg>);

}