import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
interface Step {
  label: string;
  description?: string;
}
interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}
export function Stepper({ steps, currentStep, className = '' }: StepperProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="relative flex justify-between items-center">
        {/* Connecting Line Background */}
        <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 rounded-full -z-10" />

        {/* Active Progress Line */}
        <motion.div
          className="absolute top-5 left-0 h-1 bg-toiral-primary rounded-full -z-10"
          initial={{
            width: '0%'
          }}
          animate={{
            width: `${currentStep / (steps.length - 1) * 100}%`
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut'
          }} />


        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;
          return (
            <div key={index} className="flex flex-col items-center gap-2">
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300
                  ${isCompleted ? 'bg-green-500 border-green-500 text-white' : ''}
                  ${isActive ? 'bg-white border-toiral-primary text-toiral-primary shadow-lg scale-110' : ''}
                  ${isPending ? 'bg-white border-gray-200 text-gray-300' : ''}
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1
                }}>

                {isCompleted ?
                <Check className="w-5 h-5" /> :

                <span className="font-bold text-sm">{index + 1}</span>
                }
              </motion.div>
              <div className="text-center hidden sm:block">
                <p
                  className={`text-sm font-bold transition-colors duration-300 ${isActive || isCompleted ? 'text-toiral-dark' : 'text-gray-400'}`}>

                  {step.label}
                </p>
                {step.description &&
                <p className="text-xs text-gray-400">{step.description}</p>
                }
              </div>
            </div>);

        })}
      </div>
    </div>);

}