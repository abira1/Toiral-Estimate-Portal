import React from 'react';
import { motion } from 'framer-motion';
interface TextareaProps extends
  React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}
export function Textarea({
  label,
  error,
  className = '',
  rows = 4,
  ...props
}: TextareaProps) {
  return (
    <div className={`w-full ${className}`}>
      {label &&
      <label className="block text-sm font-medium text-toiral-dark mb-1.5 ml-1">
          {label}
        </label>
      }
      <div className="relative">
        <textarea
          rows={rows}
          className={`
            w-full px-4 py-3 rounded-2xl bg-white border-2 
            focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 transition-all duration-200
            disabled:opacity-50 disabled:bg-gray-50 resize-none
            ${error ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-toiral-primary'}
            ${className}
          `}
          {...props} />

      </div>
      {error &&
      <motion.p
        initial={{
          opacity: 0,
          y: -10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="mt-1.5 text-sm text-red-500 ml-1 font-medium">

          {error}
        </motion.p>
      }
    </div>);

}