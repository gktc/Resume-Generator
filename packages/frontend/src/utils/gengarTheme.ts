/**
 * Gengar Ghost-Type Theme Utilities
 *
 * This file contains theme constants, utility functions, and helpers
 * for the Gengar-themed ATS Resume Builder.
 */

// Gengar Color Palette
export const gengarColors = {
  purple: {
    50: '#F3EEFF',
    100: '#E8D5F2',
    200: '#D4B3E6',
    300: '#B8A4D4',
    400: '#9B7BC8',
    500: '#6B4C9A',
    600: '#4A3B6B',
    700: '#3A2D54',
    800: '#2A1F3D',
    900: '#1A1226',
  },
  red: {
    DEFAULT: '#E63946',
    light: '#FF5A67',
    dark: '#C62E3A',
  },
  gold: {
    DEFAULT: '#FFD700',
    light: '#FFE44D',
    dark: '#CCB000',
  },
  background: {
    primary: '#1A1A2E',
    secondary: '#16213E',
    tertiary: '#0F1624',
  },
  ghost: {
    glow: '#B8A4D4',
    particle: '#E8D5F2',
    shadow: 'rgba(107, 76, 154, 0.3)',
  },
} as const;

// Animation durations
export const animationDurations = {
  fast: '0.2s',
  normal: '0.3s',
  slow: '0.5s',
} as const;

// Easing functions
export const easingFunctions = {
  smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  easeOut: 'ease-out',
  easeIn: 'ease-in',
} as const;

// Shadow presets
export const shadows = {
  glow: '0 0 20px rgba(184, 164, 212, 0.5)',
  glowLarge: '0 0 40px rgba(184, 164, 212, 0.6)',
  card: '0 10px 30px rgba(107, 76, 154, 0.3)',
} as const;

/**
 * Get the appropriate color for an ATS score
 * @param score - ATS score (0-100)
 * @returns Color string
 */
export const getScoreColor = (score: number): string => {
  if (score >= 80) return gengarColors.gold.DEFAULT;
  if (score >= 60) return gengarColors.purple[500];
  return gengarColors.red.DEFAULT;
};

/**
 * Get the appropriate glow color for an ATS score
 * @param score - ATS score (0-100)
 * @returns RGBA color string for glow effect
 */
export const getScoreGlow = (score: number): string => {
  if (score >= 80) return 'rgba(255, 215, 0, 0.5)';
  if (score >= 60) return 'rgba(107, 76, 154, 0.5)';
  return 'rgba(230, 57, 70, 0.5)';
};

/**
 * Check if user prefers reduced motion
 * @returns boolean indicating if reduced motion is preferred
 */
export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Get animation duration based on user preferences
 * @param duration - Default duration
 * @returns Duration string (0ms if reduced motion is preferred)
 */
export const getAnimationDuration = (duration: string): string => {
  return prefersReducedMotion() ? '0ms' : duration;
};

/**
 * Generate a random particle position
 * @returns Object with left and top percentages
 */
export const getRandomParticlePosition = (): { left: string; top: string } => {
  return {
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
  };
};

/**
 * Generate a random animation delay
 * @param maxDelay - Maximum delay in seconds
 * @returns Delay string
 */
export const getRandomAnimationDelay = (maxDelay: number = 4): string => {
  return `${Math.random() * maxDelay}s`;
};

/**
 * Get button class names based on variant
 * @param variant - Button variant ('primary' | 'secondary' | 'danger')
 * @param className - Additional class names
 * @returns Combined class string
 */
export const getButtonClasses = (
  variant: 'primary' | 'secondary' | 'danger' = 'primary',
  className: string = ''
): string => {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-all duration-300';

  const variantClasses = {
    primary:
      'bg-gengar-500 text-white hover:bg-gengar-400 shadow-gengar-glow hover:shadow-gengar-glow-lg hover:scale-105 active:scale-95',
    secondary:
      'bg-transparent border-2 border-gengar-500 text-gengar-300 hover:bg-gengar-500 hover:text-white hover:shadow-gengar-glow',
    danger:
      'bg-gengar-red text-white hover:bg-red-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95',
  };

  return `${baseClasses} ${variantClasses[variant]} ${className}`.trim();
};

/**
 * Get card class names with optional hover effect
 * @param hover - Whether to include hover effects
 * @param className - Additional class names
 * @returns Combined class string
 */
export const getCardClasses = (hover: boolean = false, className: string = ''): string => {
  const baseClasses =
    'rounded-xl p-6 bg-bg-secondary border border-gengar-600 shadow-gengar-shadow backdrop-blur-sm transition-all duration-300';
  const hoverClasses = hover
    ? 'hover:border-gengar-400 hover:shadow-gengar-glow-lg hover:-translate-y-2 hover:scale-[1.02]'
    : '';

  return `${baseClasses} ${hoverClasses} ${className}`.trim();
};

/**
 * Get input class names
 * @param className - Additional class names
 * @returns Combined class string
 */
export const getInputClasses = (className: string = ''): string => {
  const baseClasses =
    'w-full px-4 py-3 rounded-lg bg-bg-tertiary border-2 border-gengar-600 text-gengar-100 placeholder-gengar-700 focus:border-gengar-400 focus:shadow-gengar-glow focus:outline-none transition-all duration-300';

  return `${baseClasses} ${className}`.trim();
};

/**
 * Theme configuration object
 */
export const gengarTheme = {
  colors: gengarColors,
  animations: {
    durations: animationDurations,
    easings: easingFunctions,
  },
  shadows,
  utils: {
    getScoreColor,
    getScoreGlow,
    prefersReducedMotion,
    getAnimationDuration,
    getRandomParticlePosition,
    getRandomAnimationDelay,
    getButtonClasses,
    getCardClasses,
    getInputClasses,
  },
} as const;

export default gengarTheme;
