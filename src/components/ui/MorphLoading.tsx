import React from 'react';
interface MorphLoadingProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  color?: 'primary' | 'dark' | 'secondary' | 'light';
}
export function MorphLoading({
  size = 'md',
  className = '',
  color = 'primary'
}: MorphLoadingProps) {
  const containerSizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };
  const dotSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };
  const colorClasses = {
    primary: 'bg-toiral-primary',
    dark: 'bg-toiral-dark',
    secondary: 'bg-toiral-secondary',
    light: 'bg-toiral-light'
  };
  return (
    <div className={`relative ${containerSizes[size]} ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) =>
        <div
          key={i}
          className={`absolute ${dotSizes[size]} ${colorClasses[color]} shadow-lg`}
          style={{
            animation: `morph-${i} 2s infinite ease-in-out`,
            animationDelay: `${i * 0.15}s`
          }} />

        )}
      </div>
    </div>);

}
// Full page loading overlay component
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
}
export function LoadingOverlay({ isLoading, message }: LoadingOverlayProps) {
  if (!isLoading) return null;
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-toiral-bg/90 backdrop-blur-sm">
      <MorphLoading size="lg" color="primary" />
      {message &&
      <p className="mt-6 text-toiral-dark font-medium animate-pulse">
          {message}
        </p>
      }
    </div>);

}
// Inline loading spinner for buttons or small areas
interface InlineLoadingProps {
  className?: string;
}
export function InlineLoading({ className = '' }: InlineLoadingProps) {
  return (
    <div className={`relative w-6 h-6 ${className}`}>
      <div className="absolute inset-0 flex items-center justify-center">
        {[0, 1, 2, 3].map((i) =>
        <div
          key={i}
          className="absolute w-1.5 h-1.5 bg-current rounded-sm"
          style={{
            animation: `morph-${i} 1.5s infinite ease-in-out`,
            animationDelay: `${i * 0.1}s`
          }} />

        )}
      </div>
    </div>);

}