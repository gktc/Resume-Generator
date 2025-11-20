import React from 'react';

interface GengarSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const GengarSpinner: React.FC<GengarSpinnerProps> = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
  };

  const glowClasses = {
    sm: 'shadow-gengar-glow',
    md: 'shadow-gengar-glow-lg',
    lg: 'shadow-gengar-glow-lg',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {/* Rotating purple orb spinner with glow */}
      <div className="relative">
        {/* Outer glow ring */}
        <div
          className={`${sizeClasses[size]} rounded-full border-4 border-gengar-700 border-t-gengar-400 animate-spin ${glowClasses[size]}`}
        />
        
        {/* Inner pulsing orb */}
        <div
          className={`absolute inset-0 m-auto ${
            size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-8 h-8' : 'w-12 h-12'
          } rounded-full bg-gengar-400 opacity-60 animate-pulse-glow`}
        />
      </div>

      {/* Loading message */}
      {message && (
        <p className="mt-4 text-gengar-300 font-medium animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default GengarSpinner;
