import React, { useState, useEffect } from 'react';
import GengarSpinner from './GengarSpinner';

interface LoadingStateProps {
  message?: string;
  showParticles?: boolean;
  pokemonMessages?: boolean;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  message,
  showParticles = true,
  pokemonMessages = true,
}) => {
  const [currentMessage, setCurrentMessage] = useState(0);

  // Pokémon-style loading messages
  const pokemonLoadingMessages = [
    'Gengar is analyzing...',
    'Channeling ghost-type energy...',
    'Optimizing with shadow powers...',
    'Haunting the competition...',
    'Preparing your perfect resume...',
    'Almost there, trainer...',
  ];

  useEffect(() => {
    if (pokemonMessages && !message) {
      const interval = setInterval(() => {
        setCurrentMessage((prev) => (prev + 1) % pokemonLoadingMessages.length);
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [pokemonMessages, message]);

  const displayMessage = message || (pokemonMessages ? pokemonLoadingMessages[currentMessage] : undefined);

  return (
    <div className="relative flex items-center justify-center min-h-[300px] animate-fade-in">
      {/* Purple particle effects */}
      {showParticles && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-ghost-particle animate-particle-float"
              style={{
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 4}s`,
                animationDuration: `${Math.random() * 3 + 3}s`,
                opacity: 0.6,
              }}
            />
          ))}
        </div>
      )}

      {/* Spinner and message */}
      <div className="relative z-10">
        <GengarSpinner size="lg" message={displayMessage} />
      </div>
    </div>
  );
};

export default LoadingState;
