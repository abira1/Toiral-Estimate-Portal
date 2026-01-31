import React, { useState, useRef } from 'react';
import { Upload, X, File, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  onFileSelect?: (file: File) => void;
  className?: string;
}
export function FileUpload({
  label,
  accept = '*',
  maxSize = 5,
  onFileSelect,
  className = ''
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };
  const validateAndSetFile = (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      alert(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    setFile(file);
    onFileSelect?.(file);
  };
  const removeFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
  };
  return (
    <div className={`w-full ${className}`}>
      {label &&
      <label className="block text-sm font-medium text-toiral-dark mb-1.5 ml-1">
          {label}
        </label>
      }

      {!file ?
      <div
        className={`
            relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer
            ${isDragging ? 'border-toiral-primary bg-toiral-primary/5' : 'border-gray-200 hover:border-toiral-primary/50 hover:bg-gray-50'}
          `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}>

          <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleChange} />

          <div className="w-12 h-12 bg-toiral-light/30 text-toiral-primary rounded-full flex items-center justify-center mx-auto mb-3">
            <Upload className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium text-toiral-dark">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            SVG, PNG, JPG or PDF (max. {maxSize}MB)
          </p>
        </div> :

      <motion.div
        initial={{
          opacity: 0,
          y: 10
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        className="relative bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-4 shadow-sm">

          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <File className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-toiral-dark truncate">
              {file.name}
            </p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB • Completed
            </p>
          </div>
          <button
          onClick={removeFile}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors">

            <X className="w-5 h-5" />
          </button>
        </motion.div>
      }
    </div>);

}