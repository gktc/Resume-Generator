interface GhostProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

const Ghost = ({ size = 'md', className = '', animate = false }: GhostProps) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32',
  };

  return (
    <img
      src="/assets/ghost.svg"
      alt="Ghost"
      className={`${sizeClasses[size]} ${animate ? 'animate-float' : ''} ${className}`}
    />
  );
};

export default Ghost;
