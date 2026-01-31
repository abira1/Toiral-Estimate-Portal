import React from 'react';
import { ChevronDown } from 'lucide-react';
interface Option {
  value: string;
  label: string;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: Option[];
  error?: string;
}
export function Select({
  label,
  options,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className={`w-full ${className}`}>
      {label &&
      <label className="block text-sm font-medium text-toiral-dark mb-1.5 ml-1">
          {label}
        </label>
      }
      <div className="relative">
        <select
          className={`
            w-full px-4 py-3 rounded-2xl bg-white border-2 appearance-none
            focus:outline-none focus:ring-2 focus:ring-toiral-primary/20 transition-all duration-200
            disabled:opacity-50 disabled:bg-gray-50
            ${error ? 'border-red-400 focus:border-red-500' : 'border-transparent focus:border-toiral-primary'}
          `}
          {...props}>

          {options.map((option) =>
          <option key={option.value} value={option.value}>
              {option.label}
            </option>
          )}
        </select>
        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
      </div>
      {error &&
      <p className="mt-1.5 text-sm text-red-500 ml-1 font-medium">{error}</p>
      }
    </div>);

}