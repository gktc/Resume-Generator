# CSS Component Library Documentation

## Overview

This document provides comprehensive documentation for all reusable CSS component classes in the ATS Resume Builder application. These classes are defined in `src/index.css` using Tailwind's `@layer components` directive.

## Table of Contents

1. [Buttons](#buttons)
2. [Cards](#cards)
3. [Forms](#forms)
4. [Notifications](#notifications)
5. [Badges & Tags](#badges--tags)
6. [Loading States](#loading-states)
7. [Layout](#layout)
8. [Lists](#lists)
9. [Navigation](#navigation)
10. [Empty States](#empty-states)

---

## Buttons

### Primary Button
Use for main actions (submit, save, create).

```jsx
<button className="btn-primary">Save Changes</button>
<button className="btn-primary" disabled>Saving...</button>
```

**States:** hover, active, disabled

### Secondary Button
Use for secondary actions (cancel, back).

```jsx
<button className="btn-secondary">Cancel</button>
```

**States:** hover

### Ghost Button
Use for tertiary actions or subtle interactions.

```jsx
<button className="btn-ghost">Learn More</button>
```

**States:** hover

### Danger Button
Use for destructive actions (delete, remove).

```jsx
<button className="btn-danger">Delete Account</button>
```

**States:** hover, active

### Button Sizes

```jsx
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary">Default</button>
<button className="btn-primary btn-lg">Large</button>
```

### Icon Buttons

```jsx
<button className="btn-primary btn-icon">
  <svg className="w-5 h-5">...</svg>
</button>

<button className="btn-secondary btn-icon-sm">
  <svg className="w-4 h-4">...</svg>
</button>
```

---

## Cards

### Basic Card

```jsx
<div className="card">
  <h3>Card Title</h3>
  <p>Card content goes here</p>
</div>
```

**States:** hover (subtle shadow and border change)

### Interactive Card
Use for clickable cards (navigation, selection).

```jsx
<div className="card card-interactive" onClick={handleClick}>
  <h3>Clickable Card</h3>
</div>
```

**States:** hover (lifts up with stronger shadow)

### Card Variants

```jsx
<!-- No shadow -->
<div className="card card-flat">...</div>

<!-- Enhanced shadow -->
<div className="card card-elevated">...</div>
```

### Card Sections

```jsx
<div className="card">
  <div className="card-header">
    <h3>Header</h3>
  </div>
  <div className="card-body">
    <p>Body content</p>
  </div>
  <div className="card-footer">
    <button className="btn-primary">Action</button>
  </div>
</div>
```

---

## Forms

### Input Field

```jsx
<input 
  type="text" 
  className="input-field" 
  placeholder="Enter text..."
/>

<textarea className="input-field" placeholder="Enter description..."></textarea>

<select className="input-field">
  <option>Option 1</option>
  <option>Option 2</option>
</select>
```

**States:** focus, disabled, placeholder

### Input Validation States

```jsx
<!-- Error state -->
<input type="text" className="input-field input-field-error" />

<!-- Success state -->
<input type="text" className="input-field input-field-success" />
```

### Form Group Pattern

```jsx
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input type="email" className="input-field" />
  <p className="form-helper-text">We'll never share your email</p>
</div>

<!-- With error -->
<div className="form-group">
  <label className="form-label">Password</label>
  <input type="password" className="input-field input-field-error" />
  <p className="form-error-text">
    <svg className="w-4 h-4">...</svg>
    Password must be at least 8 characters
  </p>
</div>
```

### Checkboxes & Radio Buttons

```jsx
<label className="checkbox-label">
  <input type="checkbox" className="checkbox" />
  <span>I agree to the terms</span>
</label>

<label className="radio-label">
  <input type="radio" name="option" className="radio" />
  <span>Option 1</span>
</label>
```

---

## Notifications

### Notification Variants

```jsx
<!-- Success -->
<div className="notification notification-success">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">Successfully saved!</span>
</div>

<!-- Error -->
<div className="notification notification-error">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">An error occurred</span>
</div>

<!-- Warning -->
<div className="notification notification-warning">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">Please review your input</span>
</div>

<!-- Info -->
<div className="notification notification-info">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">New feature available</span>
</div>
```

### Dismissible Notification

```jsx
<div className="notification notification-success">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">Success message</span>
  <button className="notification-close" onClick={handleClose}>
    <svg className="w-4 h-4">...</svg>
  </button>
</div>
```

---

## Badges & Tags

### Badge Variants

```jsx
<span className="badge badge-success">Active</span>
<span className="badge badge-error">Failed</span>
<span className="badge badge-warning">Pending</span>
<span className="badge badge-info">New</span>
<span className="badge badge-neutral">Draft</span>
```

### Badge Sizes

```jsx
<span className="badge badge-success badge-sm">Small</span>
<span className="badge badge-success">Default</span>
<span className="badge badge-success badge-lg">Large</span>
```

### Skill Tags

```jsx
<!-- Read-only skill tag -->
<span className="skill-tag">JavaScript</span>

<!-- Removable skill tag -->
<span className="skill-tag skill-tag-removable">
  <span>React</span>
  <button className="skill-tag-remove" onClick={handleRemove}>
    <svg className="w-4 h-4">×</svg>
  </button>
</span>
```

---

## Loading States

### Spinners

```jsx
<!-- Default spinner -->
<div className="spinner"></div>

<!-- Small spinner -->
<div className="spinner spinner-sm"></div>

<!-- Large spinner -->
<div className="spinner spinner-lg"></div>

<!-- White spinner (for dark backgrounds) -->
<div className="spinner spinner-white"></div>
```

### Loading Container

```jsx
<div className="loading-container">
  <div className="spinner"></div>
  <p>Loading data...</p>
</div>
```

### Loading Overlay

```jsx
<div className="loading-overlay">
  <div className="spinner spinner-white spinner-lg"></div>
</div>
```

### Skeleton Loaders

```jsx
<!-- Text skeleton -->
<div className="skeleton skeleton-text"></div>
<div className="skeleton skeleton-text"></div>
<div className="skeleton skeleton-text" style={{width: '60%'}}></div>

<!-- Circle skeleton (for avatars) -->
<div className="skeleton skeleton-circle"></div>

<!-- Rectangle skeleton (for images/cards) -->
<div className="skeleton skeleton-rect"></div>
```

---

## Layout

### Page Container

```jsx
<div className="page-container">
  <!-- Page content -->
</div>
```

### Content Wrapper
Use for narrower content areas (articles, forms).

```jsx
<div className="content-wrapper">
  <!-- Centered content -->
</div>
```

### Section

```jsx
<section className="section">
  <h2 className="section-header">Section Title</h2>
  <!-- Section content -->
</section>
```

### Page Header

```jsx
<div className="page-header">
  <h1 className="page-title">Page Title</h1>
  <p className="page-subtitle">Optional subtitle or description</p>
</div>
```

### Back Link

```jsx
<a href="/back" className="back-link">
  <svg className="w-5 h-5">←</svg>
  <span>Back to Dashboard</span>
</a>
```

---

## Lists

### List Items

```jsx
<div className="list-item">
  <h3>Item Title</h3>
  <p>Item description</p>
</div>

<!-- Active state -->
<div className="list-item list-item-active">
  <h3>Selected Item</h3>
</div>
```

**States:** hover, active

---

## Navigation

### Navigation Links

```jsx
<a href="/dashboard" className="nav-link">Dashboard</a>

<!-- Active link -->
<a href="/profile" className="nav-link-active">Profile</a>
```

**States:** hover

---

## Empty States

### Empty State Pattern

```jsx
<div className="empty-state">
  <svg className="empty-state-icon">...</svg>
  <p className="empty-state-text">No items found</p>
  <button className="btn-primary">Create New Item</button>
</div>
```

---

## Migration Examples

### Before (Inline Utilities)

```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-lg transition-all">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

### After (Component Classes)

```jsx
<div className="card">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content</p>
</div>
```

### Hybrid Approach

When you need unique spacing or layout, combine component classes with utilities:

```jsx
<div className="card flex items-center gap-4">
  <img src="..." className="w-12 h-12 rounded-full" />
  <div className="flex-1">
    <h3>Title</h3>
    <p>Description</p>
  </div>
</div>
```

---

## Best Practices

### ✅ DO

- Use component classes for common UI patterns
- Combine component classes with utility classes when needed
- Use semantic class names that describe purpose
- Test all interactive states (hover, focus, active)
- Maintain accessibility (focus states, ARIA labels)

### ❌ DON'T

- Don't recreate component classes inline
- Don't override component class styles with !important
- Don't use component classes for one-off designs
- Don't forget to test responsive behavior
- Don't remove focus states for accessibility

---

## Color Palette

### Theme Colors

```css
Background: #FFFFFF
Text Primary: #171717
Text Secondary: #737373
Border: #E5E5E5
Border Hover: #D1D1D1

Success: #10B981
Error: #EF4444
Warning: #F59E0B
Info: #3B82F6
```

### Usage

Component classes automatically use theme colors. For custom colors, use Tailwind utilities:

```jsx
<div className="card">
  <span className="text-green-600">Custom green text</span>
</div>
```

---

## Spacing Scale

Component classes use consistent spacing:

- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)

---

## Accessibility

All component classes include:

- ✅ Proper focus states
- ✅ Sufficient color contrast (WCAG AA)
- ✅ Keyboard navigation support
- ✅ Screen reader friendly markup
- ✅ Reduced motion support

---

## Support

For questions or issues with component classes:

1. Check this documentation first
2. Review `src/index.css` for implementation details
3. Consult the design team for new patterns
4. Create a GitHub issue for bugs or enhancements
