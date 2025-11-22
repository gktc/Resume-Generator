# Black & White Minimalist Theme

## Overview
A clean, professional black and white theme with a cute ghost mascot for personality.

## Design Philosophy
- **Monochrome Elegance**: Pure black (#000000), white (#FFFFFF), and grays
- **Generous Whitespace**: Let content breathe
- **Clear Hierarchy**: Typography and spacing create structure
- **Ghost Accent**: Cute ghost SVG used sparingly for charm
- **Fast & Lightweight**: Minimal animations, maximum performance

## Color Palette

### Primary Colors
- **Black**: `#000000` - Primary actions, headings, borders
- **White**: `#FFFFFF` - Backgrounds, button text

### Gray Scale
- `gray-50`: `#FAFAFA` - Lightest backgrounds
- `gray-100`: `#F5F5F5` - Hover states
- `gray-200`: `#E5E5E5` - Borders
- `gray-300`: `#D1D1D1` - Disabled states
- `gray-400`: `#A3A3A3` - Muted text
- `gray-500`: `#737373` - Secondary text
- `gray-600`: `#525252` - Body text
- `gray-700`: `#404040` - Dark text
- `gray-800`: `#262626` - Darker elements
- `gray-900`: `#171717` - Darkest text

## Typography
- **Font Family**: Inter (clean, modern sans-serif)
- **Headings**: Bold (600-700 weight), black color
- **Body**: Regular (400 weight), gray-900 color
- **Secondary**: Medium (500 weight), gray-600 color

## Components

### Buttons
```tsx
// Primary (Black)
<button className="btn-primary">Click Me</button>

// Secondary (White with black border)
<button className="btn-secondary">Click Me</button>

// Ghost (Transparent)
<button className="btn-ghost">Click Me</button>
```

### Cards
```tsx
<div className="card">
  {/* Content */}
</div>
```

### Inputs
```tsx
<input className="input-field" placeholder="Enter text..." />
<textarea className="input-field" placeholder="Enter text..." />
<select className="input-field">
  <option>Option 1</option>
</select>
```

### Ghost Component
```tsx
import Ghost from './components/Ghost';

// Small ghost
<Ghost size="sm" />

// Medium ghost (default)
<Ghost size="md" />

// Large ghost
<Ghost size="lg" />

// Extra large ghost
<Ghost size="xl" />

// Animated floating ghost
<Ghost size="lg" animate />
```

## Ghost SVG Usage

### Where to Use
1. **Logo/Branding** - Navigation bar, loading screens
2. **Empty States** - "No data" messages
3. **Success States** - High ATS scores, completed actions
4. **404 Pages** - Error pages
5. **Decorative Accents** - Very subtle, low opacity

### Where NOT to Use
- Don't overuse - keep it special
- Avoid in forms or data-heavy interfaces
- Don't use as functional icons (use for decoration only)

## Shadows
- **Subtle**: `0 1px 3px 0 rgba(0, 0, 0, 0.1)` - Minimal depth
- **Card**: `0 2px 8px 0 rgba(0, 0, 0, 0.08)` - Default cards
- **Card Hover**: `0 4px 16px 0 rgba(0, 0, 0, 0.12)` - Elevated cards

## Animations
- **Fade In**: 0.3s ease-out
- **Slide Up**: 0.3s ease-out
- **Float**: 3s infinite (for ghost)

Keep animations minimal and purposeful.

## Accessibility
- **Contrast Ratio**: All text meets WCAG AA standards
- **Focus States**: 2px black outline with 2px offset
- **Keyboard Navigation**: Full support
- **Reduced Motion**: Respects user preferences

## Best Practices

### DO ✅
- Use generous whitespace
- Keep borders thin (1-2px)
- Use black for emphasis
- Maintain clear visual hierarchy
- Use ghost sparingly

### DON'T ❌
- Don't add colors (stay monochrome)
- Don't use heavy shadows
- Don't overuse animations
- Don't clutter the interface
- Don't overuse the ghost

## File Structure
```
packages/frontend/
├── src/
│   ├── components/
│   │   ├── Ghost.tsx          # Ghost component
│   │   └── ATSScoreDisplay.tsx # Example usage
│   ├── index.css              # Global styles
│   └── ...
├── public/
│   └── assets/
│       └── ghost.svg          # Ghost SVG asset
└── tailwind.config.js         # Theme configuration
```

## Migration from Gengar Theme
The black and white theme is a complete replacement for the Gengar purple theme. Key changes:
- Removed all purple colors
- Simplified to monochrome palette
- Replaced Gengar-specific elements with ghost
- Reduced animation complexity
- Focused on clarity and professionalism

## Examples

### ATS Score Display
- Clean circular progress gauge (black on white)
- Minimalist stat bars
- Ghost appears for high scores (80+)
- Clear typography hierarchy

### Navigation
- White background
- Black text
- Gray hover states
- Ghost logo (optional)

### Forms
- White inputs with gray borders
- Black borders on focus
- Clear error states
- Minimal styling

## Performance
- Lightweight CSS (no gradients, minimal animations)
- Single SVG asset (ghost)
- Fast load times
- Optimized for all devices
