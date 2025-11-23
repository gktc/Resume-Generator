# CSS Refactoring Design

## Overview

This design document outlines the architecture for refactoring the ATS Resume Builder CSS from inline Tailwind utilities to a maintainable component-based system. The refactoring will create a comprehensive library of reusable component classes while maintaining the Midnight Ghost theme aesthetic.

## Architecture

### Current State
- Heavy reliance on inline Tailwind utility classes
- Inconsistent styling patterns across pages
- Difficult to maintain and update theme globally
- Poor code readability due to long className strings

### Target State
- Component-based CSS architecture using Tailwind's @layer components
- Semantic, reusable class names
- Centralized theme management through tailwind.config.js
- Clean, readable JSX with minimal inline utilities
- Easy theme customization and maintenance

## Component Class Library

### 1. Button Components

```css
/* Primary Actions */
.btn-primary
.btn-primary:hover
.btn-primary:active
.btn-primary:disabled

/* Secondary Actions */
.btn-secondary
.btn-secondary:hover
.btn-secondary:active
.btn-secondary:disabled

/* Tertiary/Ghost Actions */
.btn-ghost
.btn-ghost:hover

/* Danger Actions */
.btn-danger
.btn-danger:hover

/* Button Sizes */
.btn-sm
.btn-lg

/* Icon Buttons */
.btn-icon
.btn-icon-sm
```

### 2. Card Components

```css
/* Base Card */
.card
.card:hover

/* Card Variants */
.card-interactive (clickable cards)
.card-flat (no shadow)
.card-elevated (more shadow)

/* Card Sections */
.card-header
.card-body
.card-footer
```

### 3. Form Components

```css
/* Input Fields */
.input-field (already exists)
.input-field:focus
.input-field:disabled
.input-field-error
.input-field-success

/* Form Groups */
.form-group
.form-label
.form-helper-text
.form-error-text

/* Checkboxes & Radio */
.checkbox
.radio
.checkbox-label
.radio-label

/* Select Dropdowns */
select.input-field (already exists)
.select-wrapper
```

### 4. Notification Components

```css
/* Notification Base */
.notification
.notification-success
.notification-error
.notification-warning
.notification-info

/* Notification with Icon */
.notification-icon
.notification-content
.notification-close
```

### 5. Badge Components

```css
/* Badge Variants */
.badge
.badge-success
.badge-error
.badge-warning
.badge-info
.badge-neutral

/* Badge Sizes */
.badge-sm
.badge-lg

/* Skill Tags */
.skill-tag
.skill-tag-removable
```

### 6. Loading States

```css
/* Spinners */
.spinner
.spinner-sm
.spinner-lg
.spinner-white

/* Loading Container */
.loading-container
.loading-overlay

/* Skeleton Loaders */
.skeleton
.skeleton-text
.skeleton-circle
.skeleton-rect
```

### 7. Layout Components

```css
/* Containers */
.page-container
.content-wrapper
.section

/* Headers */
.page-header
.page-title
.page-subtitle
.section-header

/* Navigation */
.nav-link (already exists)
.nav-link-active (already exists)
.back-link
```

### 8. List Components

```css
/* Lists */
.list-item
.list-item:hover
.list-item-active

/* Empty States */
.empty-state
.empty-state-icon
.empty-state-text
```

## Theme Token System

### Color Tokens (from tailwind.config.js)

```javascript
colors: {
  'bg-primary': '#0A0A0A',
  'bg-secondary': '#171717',
  'bg-tertiary': '#262626',
  'text-primary': '#FFFFFF',
  'text-secondary': '#A3A3A3',
  'border': '#404040',
  'border-hover': '#525252',
  'error': '#EF4444',
  'success': '#10B981',
  'warning': '#F59E0B',
}
```

### Spacing Scale
- Use Tailwind's default spacing scale (0.25rem increments)
- Common values: 2, 4, 6, 8, 12, 16, 24, 32

### Border Radius
- sm: 0.375rem
- DEFAULT: 0.5rem
- lg: 0.75rem
- xl: 1rem

## Implementation Strategy

### Phase 1: Expand Component Library (Week 1)
1. Add notification component classes
2. Add badge/tag component classes
3. Add loading state classes
4. Add form validation state classes
5. Add layout helper classes

### Phase 2: Create Documentation (Week 1)
1. Document all component classes with examples
2. Create visual style guide
3. Document migration patterns
4. Create before/after examples

### Phase 3: Migrate High-Priority Pages (Week 2)
1. Login/Register pages
2. Dashboard page
3. Profile pages
4. Resume generation pages

### Phase 4: Migrate Remaining Pages (Week 2-3)
1. Interview pages
2. Community pages
3. Settings pages
4. Error pages

### Phase 5: Cleanup (Week 3)
1. Remove unused utility combinations
2. Optimize CSS bundle size
3. Add CSS linting rules
4. Final documentation review

## Migration Patterns

### Before (Inline Utilities)
```jsx
<div className="bg-green-50 text-green-800 p-4 rounded-lg mb-6">
  <div className="flex items-center">
    <svg className="w-5 h-5 mr-2" fill="currentColor">...</svg>
    Success message
  </div>
</div>
```

### After (Component Classes)
```jsx
<div className="notification-success">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">Success message</span>
</div>
```

### Hybrid Approach (When Needed)
```jsx
<div className="card flex items-center gap-4">
  <!-- Component class + minimal utilities -->
</div>
```

## File Structure

```
packages/frontend/src/
├── index.css (main CSS file with @layer components)
├── styles/
│   ├── components/ (optional: split large component sets)
│   │   ├── buttons.css
│   │   ├── forms.css
│   │   ├── notifications.css
│   └── README.md (CSS documentation)
```

## Benefits

### Developer Experience
- Faster development with reusable classes
- Easier to understand component structure
- Consistent styling across application
- Reduced cognitive load

### Maintainability
- Single source of truth for component styles
- Easy theme updates (change once, apply everywhere)
- Reduced CSS bundle size (no duplicate utilities)
- Better code reviews (semantic class names)

### Performance
- Smaller HTML payload (shorter class names)
- Better CSS caching
- Reduced runtime style calculations

## Testing Strategy

### Visual Regression Testing
- Take screenshots of all pages before refactoring
- Compare after refactoring to ensure visual consistency
- Use browser dev tools to verify styles

### Manual Testing
- Test all interactive states (hover, focus, active)
- Test responsive behavior
- Test accessibility (keyboard navigation, screen readers)
- Test dark theme consistency

### Code Review Checklist
- [ ] Component classes used where appropriate
- [ ] Inline utilities only for unique cases
- [ ] Semantic class names
- [ ] Hover/focus states work correctly
- [ ] Responsive behavior maintained
- [ ] Accessibility not degraded

## Success Metrics

1. **Code Readability**: Average className length reduced by 50%
2. **Maintainability**: Theme color changes require updates in 1 file only
3. **Consistency**: 90%+ of similar UI patterns use same component classes
4. **Performance**: CSS bundle size reduced by 20%
5. **Developer Velocity**: New feature development 30% faster

## Risks and Mitigation

### Risk: Breaking Existing Functionality
**Mitigation**: Migrate one page at a time, test thoroughly before moving to next

### Risk: Inconsistent Application
**Mitigation**: Create clear documentation and code review guidelines

### Risk: Over-abstraction
**Mitigation**: Only create component classes for patterns used 3+ times

### Risk: Team Adoption
**Mitigation**: Provide training, examples, and clear migration guide
