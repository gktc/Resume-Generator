# CSS Refactoring Requirements

## Introduction

This specification defines the requirements for refactoring the ATS Resume Builder frontend CSS architecture from inline Tailwind classes to a maintainable, reusable component-based system. The goal is to improve code quality, readability, and customizability while maintaining the Midnight Ghost theme.

## Glossary

- **Component Class**: A reusable CSS class defined in index.css using Tailwind's @layer components
- **Utility Class**: Tailwind's built-in utility classes (e.g., flex, grid, gap-4)
- **Theme Token**: CSS custom properties or Tailwind config values for colors, spacing, etc.
- **Inline CSS**: Tailwind utility classes applied directly in JSX className attributes
- **Semantic Class**: A class name that describes purpose rather than appearance (e.g., .notification-success vs .bg-green-50)

## Requirements

### Requirement 1: Component Class System

**User Story:** As a developer, I want a comprehensive set of reusable component classes, so that I can build UI consistently without repeating inline styles.

#### Acceptance Criteria

1. WHEN defining component classes THEN the system SHALL organize them by category (buttons, cards, inputs, notifications, badges, etc.)
2. WHEN creating component classes THEN the system SHALL use semantic naming that describes purpose not appearance
3. WHEN a component pattern appears 3+ times THEN the system SHALL extract it into a reusable component class
4. WHEN component classes are defined THEN the system SHALL include hover, focus, active, and disabled states where applicable
5. WHEN component classes use colors THEN the system SHALL reference theme tokens from tailwind.config.js

### Requirement 2: Notification System

**User Story:** As a developer, I want standardized notification classes, so that success/error/warning messages look consistent across the application.

#### Acceptance Criteria

1. WHEN displaying notifications THEN the system SHALL provide classes for success, error, warning, and info variants
2. WHEN a notification is shown THEN the system SHALL include appropriate icon styling and spacing
3. WHEN notifications use colors THEN the system SHALL use dark theme appropriate colors with proper contrast
4. WHEN notifications are dismissed THEN the system SHALL support animation classes for smooth transitions

### Requirement 3: Form Component Classes

**User Story:** As a developer, I want comprehensive form component classes, so that forms are consistent and accessible throughout the application.

#### Acceptance Criteria

1. WHEN creating form inputs THEN the system SHALL provide classes for text inputs, textareas, selects, checkboxes, and radio buttons
2. WHEN form inputs have validation states THEN the system SHALL provide error and success state classes
3. WHEN form labels are used THEN the system SHALL provide consistent label styling classes
4. WHEN form groups are created THEN the system SHALL provide spacing and layout classes
5. WHEN forms are disabled THEN the system SHALL provide appropriate disabled state styling

### Requirement 4: Layout Component Classes

**User Story:** As a developer, I want layout component classes, so that page structure is consistent and responsive.

#### Acceptance Criteria

1. WHEN creating page layouts THEN the system SHALL provide container, section, and content wrapper classes
2. WHEN building responsive layouts THEN the system SHALL provide grid and flex layout helper classes
3. WHEN spacing elements THEN the system SHALL provide consistent spacing scale classes
4. WHEN creating headers THEN the system SHALL provide page header and section header classes

### Requirement 5: Badge and Tag Classes

**User Story:** As a developer, I want badge and tag component classes, so that status indicators and labels are consistent.

#### Acceptance Criteria

1. WHEN displaying status THEN the system SHALL provide badge classes for different states (active, inactive, pending, etc.)
2. WHEN showing tags THEN the system SHALL provide tag classes with optional close buttons
3. WHEN badges use colors THEN the system SHALL use theme-appropriate colors with good contrast
4. WHEN badges are sized THEN the system SHALL provide small, medium, and large variants

### Requirement 6: Loading State Classes

**User Story:** As a developer, I want standardized loading state classes, so that loading indicators are consistent.

#### Acceptance Criteria

1. WHEN showing loading states THEN the system SHALL provide spinner component classes
2. WHEN content is loading THEN the system SHALL provide skeleton loader classes
3. WHEN loading overlays are needed THEN the system SHALL provide overlay classes with proper z-index
4. WHEN spinners are sized THEN the system SHALL provide small, medium, and large variants

### Requirement 7: Migration Strategy

**User Story:** As a developer, I want a clear migration strategy, so that existing pages can be refactored systematically without breaking functionality.

#### Acceptance Criteria

1. WHEN migrating pages THEN the system SHALL provide a priority order (high-traffic pages first)
2. WHEN refactoring a page THEN the system SHALL maintain existing functionality and appearance
3. WHEN component classes are insufficient THEN the system SHALL allow utility classes for unique cases
4. WHEN migration is complete THEN the system SHALL document all available component classes
5. WHEN new features are added THEN the system SHALL use component classes by default

### Requirement 8: Documentation

**User Story:** As a developer, I want comprehensive CSS documentation, so that I know which classes to use for different UI patterns.

#### Acceptance Criteria

1. WHEN component classes are created THEN the system SHALL document them with examples
2. WHEN classes have variants THEN the system SHALL document all available variants
3. WHEN classes have states THEN the system SHALL document hover, focus, active, and disabled states
4. WHEN combining classes THEN the system SHALL provide common pattern examples
5. WHEN theme tokens are used THEN the system SHALL document the color palette and spacing scale
