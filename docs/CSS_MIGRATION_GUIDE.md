# CSS Migration Guide

## Overview

This guide helps developers migrate from inline Tailwind utilities to the component-based CSS architecture. It provides patterns, best practices, and examples for maintaining consistency across the application.

---

## Table of Contents

1. [When to Use Component Classes](#when-to-use-component-classes)
2. [Migration Patterns](#migration-patterns)
3. [Common Migrations](#common-migrations)
4. [Hybrid Approach](#hybrid-approach)
5. [Creating New Component Classes](#creating-new-component-classes)
6. [Best Practices](#best-practices)
7. [Troubleshooting](#troubleshooting)

---

## When to Use Component Classes

### ✅ Use Component Classes When:

- The pattern appears **3 or more times** in the codebase
- It's a **standard UI component** (button, card, input, notification)
- You want **consistent styling** across the application
- The component has **multiple states** (hover, focus, active, disabled)
- It's part of the **design system** (colors, spacing, typography)

### ❌ Use Inline Utilities When:

- It's a **one-off design** that won't be reused
- You need **unique spacing or layout** for a specific context
- You're **prototyping** and haven't identified patterns yet
- The styling is **highly contextual** and doesn't fit existing components

---

## Migration Patterns

### Pattern 1: Simple Button Migration

**Before:**
```jsx
<button className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-all">
  Save Changes
</button>
```

**After:**
```jsx
<button className="btn-primary">
  Save Changes
</button>
```

**Benefit:** 90% reduction in className length, consistent button styling

---

### Pattern 2: Card Component Migration

**Before:**
```jsx
<div className="bg-white border border-gray-200 rounded-xl p-6 hover:border-gray-300 hover:shadow-lg transition-all">
  <h3 className="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

**After:**
```jsx
<div className="card">
  <h3 className="text-lg font-semibold mb-2">Card Title</h3>
  <p className="text-gray-600">Card content goes here</p>
</div>
```

**Benefit:** Cleaner JSX, consistent card styling, automatic hover states

---

### Pattern 3: Form Input Migration

**Before:**
```jsx
<input
  type="text"
  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:border-black transition-all"
  placeholder="Enter your name"
/>
```

**After:**
```jsx
<input
  type="text"
  className="input-field"
  placeholder="Enter your name"
/>
```

**Benefit:** Consistent input styling, automatic focus states, accessibility

---

### Pattern 4: Notification Migration

**Before:**
```jsx
<div className="flex items-center gap-2 p-4 mb-6 border border-red-300 rounded-lg bg-red-50 text-red-600">
  <svg className="w-5 h-5 flex-shrink-0" fill="currentColor">...</svg>
  <span>An error occurred</span>
</div>
```

**After:**
```jsx
<div className="notification-error">
  <svg className="notification-icon">...</svg>
  <span className="notification-content">An error occurred</span>
</div>
```

**Benefit:** Consistent notification styling, semantic class names

---

### Pattern 5: Form Group Migration

**Before:**
```jsx
<div className="mb-6">
  <label className="block mb-2 text-gray-900 text-sm font-medium">
    Email Address
  </label>
  <input
    type="email"
    className="w-full px-4 py-3 border border-gray-200 rounded-lg"
  />
  <p className="mt-1 text-sm text-gray-500">We'll never share your email</p>
</div>
```

**After:**
```jsx
<div className="form-group">
  <label className="form-label">Email Address</label>
  <input type="email" className="input-field" />
  <p className="form-helper-text">We'll never share your email</p>
</div>
```

**Benefit:** Consistent form styling, proper spacing, semantic structure

---

## Common Migrations

### Buttons

| Before | After | Use Case |
|--------|-------|----------|
| `bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800` | `btn-primary` | Primary actions |
| `bg-white text-black px-6 py-3 rounded-lg border-2 border-black hover:bg-gray-50` | `btn-secondary` | Secondary actions |
| `bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700` | `btn-danger` | Destructive actions |
| `px-4 py-2 text-sm` | `btn-primary btn-sm` | Small buttons |

### Cards

| Before | After | Use Case |
|--------|-------|----------|
| `bg-white border border-gray-200 rounded-xl p-6` | `card` | Basic card |
| `bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg cursor-pointer` | `card card-interactive` | Clickable card |
| `bg-white rounded-xl p-6` | `card card-flat` | Card without border |

### Form Elements

| Before | After | Use Case |
|--------|-------|----------|
| `w-full px-4 py-3 border border-gray-200 rounded-lg` | `input-field` | Text input |
| `w-full px-4 py-3 border border-red-300 rounded-lg` | `input-field input-field-error` | Error state |
| `w-full px-4 py-3 border border-green-300 rounded-lg` | `input-field input-field-success` | Success state |

### Notifications

| Before | After | Use Case |
|--------|-------|----------|
| `bg-green-50 text-green-800 p-4 rounded-lg border border-green-300` | `notification-success` | Success message |
| `bg-red-50 text-red-600 p-4 rounded-lg border border-red-300` | `notification-error` | Error message |
| `bg-yellow-50 text-yellow-800 p-4 rounded-lg border border-yellow-300` | `notification-warning` | Warning message |

### Badges

| Before | After | Use Case |
|--------|-------|----------|
| `bg-green-100 text-green-800 px-2 py-1 rounded text-xs` | `badge badge-success` | Success badge |
| `bg-red-100 text-red-800 px-2 py-1 rounded text-xs` | `badge badge-error` | Error badge |
| `bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs` | `badge badge-neutral` | Neutral badge |

---

## Hybrid Approach

Sometimes you need to combine component classes with utility classes for unique layouts:

### Example 1: Card with Custom Layout

```jsx
<div className="card flex items-center gap-4">
  <img src="avatar.jpg" className="w-12 h-12 rounded-full" />
  <div className="flex-1">
    <h3 className="font-semibold">John Doe</h3>
    <p className="text-sm text-gray-600">Software Engineer</p>
  </div>
  <button className="btn-primary btn-sm">Follow</button>
</div>
```

**Why:** The card component provides base styling, but we need custom flex layout for this specific use case.

### Example 2: Form with Custom Grid

```jsx
<form className="space-y-6">
  <div className="grid grid-cols-2 gap-4">
    <div className="form-group">
      <label className="form-label">First Name</label>
      <input type="text" className="input-field" />
    </div>
    <div className="form-group">
      <label className="form-label">Last Name</label>
      <input type="text" className="input-field" />
    </div>
  </div>
  <button className="btn-primary w-full">Submit</button>
</form>
```

**Why:** Form components provide consistent styling, but we need custom grid layout for side-by-side inputs.

### Example 3: Responsive Card Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <div className="card">...</div>
  <div className="card">...</div>
  <div className="card">...</div>
</div>
```

**Why:** Card component provides styling, but we need responsive grid utilities for layout.

---

## Creating New Component Classes

### When to Create a New Component Class

1. **Pattern appears 3+ times** in the codebase
2. **Consistent styling is needed** across multiple pages
3. **Multiple states are required** (hover, focus, active)
4. **It's part of the design system**

### How to Create a New Component Class

1. **Identify the pattern** in your code
2. **Choose a semantic name** (describe purpose, not appearance)
3. **Add to `index.css`** in the `@layer components` section
4. **Document in `styles/README.md`** with examples
5. **Update this migration guide** with the new pattern

### Example: Creating a New Badge Variant

**Step 1:** Identify the pattern
```jsx
// This appears 5+ times in the codebase
<span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs font-medium">
  Premium
</span>
```

**Step 2:** Add to `index.css`
```css
@layer components {
  .badge-premium {
    background-color: #f3e8ff;
    color: #7c3aed;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }
}
```

**Step 3:** Document in `styles/README.md`
```markdown
### Premium Badge
Use for premium features or paid content.

\`\`\`jsx
<span className="badge-premium">Premium</span>
\`\`\`
```

**Step 4:** Update this guide
Add to the "Common Migrations" section.

---

## Best Practices

### ✅ DO

1. **Use semantic class names**
   ```jsx
   // Good
   <button className="btn-primary">Submit</button>
   
   // Bad
   <button className="black-button">Submit</button>
   ```

2. **Combine component classes with utilities when needed**
   ```jsx
   // Good
   <div className="card flex items-center gap-4">...</div>
   ```

3. **Test all interactive states**
   ```jsx
   // Test hover, focus, active, disabled
   <button className="btn-primary" disabled>Disabled</button>
   ```

4. **Maintain accessibility**
   ```jsx
   // Good - focus states are built into component classes
   <button className="btn-primary">Accessible Button</button>
   ```

5. **Document new patterns**
   - Add to `styles/README.md`
   - Update this migration guide
   - Add examples

### ❌ DON'T

1. **Don't recreate component classes inline**
   ```jsx
   // Bad - use .btn-primary instead
   <button className="bg-black text-white px-6 py-3 rounded-lg">
     Submit
   </button>
   ```

2. **Don't override component classes with !important**
   ```jsx
   // Bad
   <button className="btn-primary" style={{background: 'red !important'}}>
     Submit
   </button>
   
   // Good - create a new variant or use inline utilities
   <button className="btn-danger">Delete</button>
   ```

3. **Don't use component classes for one-off designs**
   ```jsx
   // Bad - creating a component class used only once
   .special-card-only-used-once { ... }
   
   // Good - use inline utilities
   <div className="card bg-gradient-to-r from-purple-500 to-pink-500">
     ...
   </div>
   ```

4. **Don't forget responsive behavior**
   ```jsx
   // Good - combine component classes with responsive utilities
   <button className="btn-primary w-full md:w-auto">
     Submit
   </button>
   ```

---

## Troubleshooting

### Issue: Component class not applying

**Problem:** You added a component class but it's not showing up.

**Solution:**
1. Check that you added it to `@layer components` in `index.css`
2. Restart the dev server (Vite may need to rebuild)
3. Check browser DevTools to see if the class is being applied
4. Verify there are no typos in the class name

### Issue: Styles are being overridden

**Problem:** Component class styles are being overridden by other styles.

**Solution:**
1. Check CSS specificity - component classes should be in `@layer components`
2. Avoid using `!important` - create a new variant instead
3. Use browser DevTools to see which styles are winning
4. Consider creating a more specific variant

### Issue: Need to customize a component class

**Problem:** You need slightly different styling than the component class provides.

**Solution:**
1. **Option 1:** Combine with utility classes
   ```jsx
   <button className="btn-primary text-lg">Larger Button</button>
   ```

2. **Option 2:** Create a new variant
   ```css
   .btn-primary-lg {
     @apply btn-primary text-lg px-8 py-4;
   }
   ```

3. **Option 3:** Use inline utilities for one-off cases
   ```jsx
   <button className="btn-primary shadow-2xl">Special Button</button>
   ```

### Issue: Component class missing a state

**Problem:** You need a state (hover, focus, active) that doesn't exist.

**Solution:**
1. Add the state to `index.css`
   ```css
   .btn-primary:active {
     transform: scale(0.98);
   }
   ```

2. Document the new state in `styles/README.md`
3. Test the state in all browsers

---

## Migration Checklist

When migrating a page or component:

- [ ] Identify all repeated patterns
- [ ] Replace inline utilities with component classes
- [ ] Test all interactive states (hover, focus, active, disabled)
- [ ] Test responsive behavior at all breakpoints
- [ ] Test keyboard navigation
- [ ] Verify accessibility (focus states, color contrast)
- [ ] Check browser compatibility
- [ ] Update documentation if new patterns are found
- [ ] Review code with team

---

## Examples from Real Migrations

### Example 1: LoginPage.tsx

**Before:**
```jsx
<div className="min-h-screen flex items-center justify-center bg-white">
  <div className="max-w-md w-full space-y-8 p-8">
    <h2 className="text-3xl font-bold text-center text-gray-900">
      Sign in to your account
    </h2>
    <form className="mt-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email address
        </label>
        <input
          type="email"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>
      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800"
      >
        Sign in
      </button>
    </form>
  </div>
</div>
```

**After:**
```jsx
<div className="min-h-screen flex items-center justify-center bg-white">
  <div className="max-w-md w-full space-y-8 p-8">
    <h2 className="page-title text-center">
      Sign in to your account
    </h2>
    <form className="mt-8 space-y-6">
      <div className="form-group">
        <label className="form-label">Email address</label>
        <input type="email" className="input-field" />
      </div>
      <button type="submit" className="btn-primary w-full">
        Sign in
      </button>
    </form>
  </div>
</div>
```

**Changes:**
- `text-3xl font-bold text-gray-900` → `page-title`
- `block text-sm font-medium text-gray-700` → `form-label`
- Long input classes → `input-field`
- Long button classes → `btn-primary`

**Result:** 60% reduction in className length, improved readability

---

### Example 2: ResumeHistoryPage.tsx

**Before:**
```jsx
<div className="bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-lg transition-all cursor-pointer">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold text-gray-900">
      Software Engineer Resume
    </h3>
    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
      Active
    </span>
  </div>
  <p className="text-sm text-gray-600 mb-4">
    Created on Nov 15, 2024
  </p>
  <button className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800">
    Download PDF
  </button>
</div>
```

**After:**
```jsx
<div className="card card-interactive">
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-lg font-semibold">
      Software Engineer Resume
    </h3>
    <span className="badge badge-success">Active</span>
  </div>
  <p className="text-sm text-gray-600 mb-4">
    Created on Nov 15, 2024
  </p>
  <button className="btn-primary">Download PDF</button>
</div>
```

**Changes:**
- Long card classes → `card card-interactive`
- Badge classes → `badge badge-success`
- Button classes → `btn-primary`

**Result:** Cleaner JSX, consistent styling, automatic hover states

---

## Resources

- **[CSS Component Library](../packages/frontend/src/styles/README.md)** - Complete component documentation
- **[CSS Refactoring Testing](CSS_REFACTORING_TESTING.md)** - Testing results and accessibility report
- **[Tailwind CSS Documentation](https://tailwindcss.com/docs)** - Official Tailwind docs
- **[WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)** - Accessibility guidelines

---

## Getting Help

If you're unsure about:
- **Which component class to use** → Check `styles/README.md`
- **How to migrate a pattern** → Check this guide's examples
- **Whether to create a new class** → Ask: "Does this pattern appear 3+ times?"
- **Accessibility concerns** → Check `CSS_REFACTORING_TESTING.md`

For questions or issues:
1. Check existing documentation
2. Review similar components in the codebase
3. Ask the team in code review
4. Create a GitHub issue for new patterns

---

## Conclusion

The component-based CSS architecture provides:
- ✅ **Consistency** across the application
- ✅ **Maintainability** with single source of truth
- ✅ **Performance** with smaller CSS bundle
- ✅ **Developer Experience** with semantic class names
- ✅ **Accessibility** built into all components

Follow this guide to maintain these benefits as the application grows.

**Happy coding!** 🎨
