import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  progress: number;
  label?: string;
  showPercentage?: boolean;
  className?: string;
  color?: string;
}
export function ProgressBar({
  progress,
  label,
  showPercentage = true,
  className = '',
  color = 'bg-toiral-primary'
}: ProgressBarProps) {
  // Clamp progress between 0 and 100
  const clampedProgress = Math.min(100, Math.max(0, progress));
  return (
    <div className={`w-full ${className}`}>
      {(label || showPercentage) &&
      <div className="flex justify-between items-center mb-2">
          {label &&
        <span className="text-sm font-medium text-toiral-dark">
              {label}
            </span>
        }
          {showPercentage &&
        <span className="text-sm font-bold text-toiral-primary">
              {Math.round(clampedProgress)}%
            </span>
        }
        </div>
      }
      <div className="h-3 w-full bg-toiral-light/30 rounded-full overflow-hidden">
        <motion.div
          initial={{
            width: 0
          }}
          animate={{
            width: `${clampedProgress}%`
          }}
          transition={{
            duration: 1,
            ease: 'easeOut'
          }}
          className={`h-full rounded-full ${color}`} />

      </div>
    </div>);

}