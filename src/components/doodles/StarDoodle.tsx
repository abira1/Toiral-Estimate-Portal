import React from 'react';
import { motion } from 'framer-motion';
interface DoodleProps {
  className?: string;
  color?: string;
  size?: number;
}
export function StarDoodle({
  className = '',
  color = '#67A8A9',
  size = 24
}: DoodleProps) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      whileHover={{
        rotate: 180,
        scale: 1.2
      }}
      transition={{
        duration: 0.5
      }}>

      <path
        d="M12 2L14.4 9.6H22L16 14.4L18.4 22L12 17.6L5.6 22L8 14.4L2 9.6H9.6L12 2Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-sm" />

    </motion.svg>);

}