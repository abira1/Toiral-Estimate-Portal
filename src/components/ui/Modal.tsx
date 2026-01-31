import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from './Button';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  className = ''
}: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          {/* Backdrop */}
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={onClose}
          className="fixed inset-0 bg-toiral-dark/40 backdrop-blur-sm z-40" />


          {/* Modal Content - Fully Responsive */}
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none overflow-y-auto p-0 sm:p-4">
            <motion.div
            initial={{
              scale: 0.95,
              opacity: 0,
              y: 20
            }}
            animate={{
              scale: 1,
              opacity: 1,
              y: 0
            }}
            exit={{
              scale: 0.95,
              opacity: 0,
              y: 20
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            className={`bg-white w-full sm:max-w-lg sm:rounded-3xl rounded-t-3xl shadow-2xl pointer-events-auto flex flex-col max-h-[95vh] sm:max-h-[90vh] my-auto ${className}`}>

              {/* Header - Fixed */}
              <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-100 flex-shrink-0">
                {title &&
              <h3 className="text-lg sm:text-xl font-bold text-toiral-dark pr-8">
                    {title}
                  </h3>
              }
                <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="!p-2 h-auto absolute right-4 top-4 sm:relative sm:right-auto sm:top-auto">

                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Content - Scrollable */}
              <div className="p-4 sm:p-6 overflow-y-auto flex-1">
                {children}
              </div>
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}