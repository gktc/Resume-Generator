# Gengar Theme Utilities

This directory contains utility functions and constants for the Gengar Ghost-Type theme.

## Files

### `gengarTheme.ts`

Main theme configuration file containing:

- **Color Palette**: Complete Gengar-inspired color system
- **Animation Utilities**: Duration and easing presets
- **Shadow Presets**: Glow and shadow effects
- **Helper Functions**:
  - `getScoreColor(score)`: Returns appropriate color for ATS scores
  - `getScoreGlow(score)`: Returns glow effect for ATS scores
  - `prefersReducedMotion()`: Checks user's motion preferences
  - `getAnimationDuration(duration)`: Respects reduced motion settings
  - `getRandomParticlePosition()`: Generates random positions for particles
  - `getRandomAnimationDelay(maxDelay)`: Generates random animation delays
  - `getButtonClasses(variant, className)`: Returns button class strings
  - `getCardClasses(hover, className)`: Returns card class strings
  - `getInputClasses(className)`: Returns input class strings

## Usage Examples

```typescript
import { gengarTheme, getScoreColor, getButtonClasses } from '@/utils/gengarTheme';

// Get color for ATS score
const scoreColor = getScoreColor(85); // Returns gold color

// Get button classes
const buttonClass = getButtonClasses('primary', 'w-full');

// Access theme colors
const primaryPurple = gengarTheme.colors.purple[500];

// Check for reduced motion
if (gengarTheme.utils.prefersReducedMotion()) {
  // Disable animations
}
```

## Theme Configuration

The theme is configured in three places:

1. **Tailwind Config** (`tailwind.config.js`): Extends Tailwind with Gengar colors, animations, and utilities
2. **Global CSS** (`index.css`): Defines CSS custom properties, base styles, and component classes
3. **Theme Utilities** (`gengarTheme.ts`): Provides JavaScript/TypeScript helpers

## Color System

### Primary Palette (Gengar Purple)
- `gengar-50` to `gengar-900`: Full purple scale
- `gengar-500`: Primary brand color (#6B4C9A)

### Accent Colors
- `gengar-red`: Error states and danger actions (#E63946)
- `gengar-gold`: Success states and high scores (#FFD700)

### Backgrounds
- `bg-primary`: Main dark background (#1A1A2E)
- `bg-secondary`: Card backgrounds (#16213E)
- `bg-tertiary`: Input backgrounds (#0F1624)

### Ghost Effects
- `ghost-glow`: Purple glow color (#B8A4D4)
- `ghost-particle`: Particle effect color (#E8D5F2)

## Animations

Available animations:
- `animate-float`: Floating effect (3s)
- `animate-pulse-glow`: Pulsing glow effect (2s)
- `animate-fade-in`: Fade in effect (0.5s)
- `animate-slide-up`: Slide up effect (0.4s)
- `animate-particle-float`: Particle floating effect (4s)

## Accessibility

The theme includes:
- WCAG AA compliant color contrasts
- Reduced motion support via `prefers-reduced-motion`
- Keyboard focus indicators
- Screen reader friendly markup

## Performance

Optimizations included:
- GPU-accelerated animations (transform, opacity)
- Reduced particle effects on mobile
- Lazy loading for background patterns
- CSS gradients instead of images where possible
