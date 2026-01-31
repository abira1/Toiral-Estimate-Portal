import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
interface TeamMemberCardProps {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  projectCount: number;
  selected?: boolean;
  onSelect?: () => void;
}
export function TeamMemberCard({
  name,
  role,
  avatar,
  projectCount,
  selected = false,
  onSelect
}: TeamMemberCardProps) {
  return (
    <motion.div
      onClick={onSelect}
      whileHover={{
        y: -4
      }}
      whileTap={{
        scale: 0.98
      }}
      className={`
        relative p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200
        ${selected ? 'border-toiral-primary bg-toiral-primary/5' : 'border-transparent bg-white hover:border-gray-200 shadow-soft'}
      `}>

      {selected &&
      <div className="absolute top-3 right-3 w-6 h-6 bg-toiral-primary rounded-full flex items-center justify-center text-white">
          <Check className="w-3.5 h-3.5" />
        </div>
      }

      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600 overflow-hidden">
          {avatar ?
          <img
            src={avatar}
            alt={name}
            className="w-full h-full object-cover" /> :


          name.charAt(0)
          }
        </div>
        <div>
          <h4 className="font-bold text-toiral-dark">{name}</h4>
          <p className="text-xs text-gray-500">{role}</p>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-gray-100/50 flex justify-between items-center">
        <span className="text-xs text-gray-400">Active Projects</span>
        <span className="px-2 py-1 rounded-lg bg-gray-100 text-xs font-bold text-gray-600">
          {projectCount}
        </span>
      </div>
    </motion.div>);

}