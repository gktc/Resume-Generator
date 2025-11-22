# 🎨 Professional Font Guide

## Font Strategy

### **Poppins** (All Text)
- Modern, geometric sans-serif
- Professional and friendly
- Excellent readability at all sizes
- Used by Google, Airbnb, and many modern apps
- Perfect for a resume builder
- Google Font (free)

## Visual Hierarchy

```
ATS Resume Builder          ← h1 (Creepster, 48px) 👻
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Dashboard                   ← h2 (Creepster, 36px) 👻

Your Recent Resumes         ← h3 (Creepster, 24px) 👻

Create a new resume to get started with 
your job search. Our AI-powered system 
will help you craft the perfect resume.
                            ← body (Inter, 16px)

[Generate Resume]           ← button (Inter, 16px)
```

## Usage Examples

### HTML/JSX
```tsx
<h1 className="text-5xl">Spooky Resume Builder</h1>
<h2 className="text-4xl">Dashboard</h2>
<h3 className="text-2xl">Recent Resumes</h3>
<p className="text-base">Your body text goes here...</p>
```

### With Tailwind Classes
```tsx
// Spooky heading
<h1 className="font-spooky text-5xl text-black">
  Welcome Back!
</h1>

// Regular body text
<p className="font-sans text-base text-gray-700">
  This is your dashboard where you can manage all your resumes.
</p>
```

## Font Weights

### Creepster (Headings)
- **400** (Regular) - Only weight available, perfect for all headings

### Inter (Body)
- **300** (Light) - Rarely used
- **400** (Regular) - Body text, paragraphs
- **500** (Medium) - Buttons, labels, emphasis
- **600** (Semi-Bold) - Subheadings, important text
- **700** (Bold) - Strong emphasis

## Alternative Spooky Fonts

If you want to try different options:

### 1. **Nosifer** (More Horror)
```css
@import url('https://fonts.googleapis.com/css2?family=Nosifer&display=swap');
```
- Very spooky, dripping blood effect
- Use sparingly (maybe just for logo)

### 2. **Eater** (Zombie Style)
```css
@import url('https://fonts.googleapis.com/css2?family=Eater&display=swap');
```
- Decayed, zombie-like
- Good for Halloween themes

### 3. **Butcherman** (Slasher Style)
```css
@import url('https://fonts.googleapis.com/css2?family=Butcherman&display=swap');
```
- Horror movie poster style
- Very bold and impactful

### 4. **Special Elite** (Typewriter Ghost)
```css
@import url('https://fonts.googleapis.com/css2?family=Special+Elite&display=swap');
```
- Typewriter style
- Subtle spooky, more professional
- Good compromise if Creepster is too much

## Current Implementation

### In `index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Creepster&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

h1, h2, h3, h4, h5, h6 {
  font-family: 'Creepster', cursive;
  color: #000000;
  font-weight: 400;
  letter-spacing: 0.02em;
}

body {
  font-family: 'Inter', system-ui, sans-serif;
}
```

### In `tailwind.config.js`:
```javascript
fontFamily: {
  sans: ['Inter', 'system-ui', 'sans-serif'],
  spooky: ['Creepster', 'cursive'],
  mono: ['JetBrains Mono', 'Courier New', 'monospace'],
}
```

## Best Practices

### DO ✅
- Use Creepster for headings and titles
- Use Inter for body text and UI elements
- Keep letter-spacing slightly increased for Creepster
- Use the ghost SVG alongside spooky text

### DON'T ❌
- Don't use Creepster for long paragraphs (hard to read)
- Don't use Creepster for buttons or small text
- Don't mix multiple spooky fonts
- Don't use all caps with Creepster (already bold enough)

## Accessibility Notes

- Creepster is decorative but still readable
- Always maintain proper contrast ratios
- Body text uses clean Inter for maximum readability
- Users can still read all content comfortably

## Examples in Components

### Navigation
```tsx
<nav className="bg-white border-b-2 border-black">
  <div className="flex items-center gap-3">
    <Ghost size="sm" />
    <span className="font-spooky text-2xl text-black">
      Resume Builder
    </span>
  </div>
</nav>
```

### ATS Score Display
```tsx
<h3 className="font-spooky text-3xl text-black mb-2">
  ATS Compatibility Score
</h3>
<p className="font-sans text-gray-600 text-lg">
  How well your resume performs with Applicant Tracking Systems
</p>
```

### Empty State
```tsx
<div className="text-center">
  <Ghost size="xl" animate />
  <h3 className="font-spooky text-2xl text-black mt-4">
    No Resumes Yet
  </h3>
  <p className="font-sans text-gray-600 mt-2">
    Let's create your first spooky-good resume!
  </p>
</div>
```

## Testing the Fonts

To see how the fonts look, check:
1. Main headings on dashboard
2. ATS Score Display component
3. Navigation bar
4. Empty states
5. Button labels

The combination of spooky headings with clean body text creates a fun, memorable experience while maintaining professionalism!
