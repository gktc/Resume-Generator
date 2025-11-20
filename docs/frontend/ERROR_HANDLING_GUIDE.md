# Frontend Error Handling Guide

## Overview

The frontend implements a comprehensive error handling system with Error Boundaries, Toast notifications, and utility functions for handling API errors.

## Components

### 1. ErrorBoundary

Catches React errors and prevents the entire app from crashing.

**Usage:**
```tsx
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <YourApp />
    </ErrorBoundary>
  );
}
```

**Features:**
- Catches all React component errors
- Shows user-friendly error UI
- Displays error details in development
- Provides "Try Again" and "Go Home" buttons

### 2. Toast Notifications

Display temporary notifications for success, error, warning, and info messages.

**Setup:**
```tsx
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ToastContainer';

function App() {
  return (
    <ToastProvider>
      <ToastContainer />
      <YourApp />
    </ToastProvider>
  );
}
```

**Usage:**
```tsx
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showWarning, showInfo } = useToast();

  const handleSubmit = async () => {
    try {
      await api.post('/endpoint', data);
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data');
    }
  };
}
```

**Toast Types:**
- `showSuccess(message, duration?)` - Green success toast
- `showError(message, duration?)` - Red error toast
- `showWarning(message, duration?)` - Yellow warning toast
- `showInfo(message, duration?)` - Blue info toast

Default duration is 5000ms (5 seconds). Set to 0 for persistent toasts.

### 3. FormError Component

Display validation errors in forms.

**Usage:**
```tsx
import FormError from './components/FormError';

function MyForm() {
  const [emailError, setEmailError] = useState('');

  return (
    <div>
      <input type="email" />
      <FormError message={emailError} />
    </div>
  );
}
```

## Error Handling Utilities

### getErrorMessage

Extract user-friendly error message from any error type.

```tsx
import { getErrorMessage } from '../utils/errorHandler';

try {
  await api.post('/endpoint', data);
} catch (error) {
  const message = getErrorMessage(error);
  console.log(message); // "Invalid email or password"
}
```

### getUserFriendlyMessage

Get user-friendly message based on error code.

```tsx
import { getUserFriendlyMessage } from '../utils/errorHandler';

const message = getUserFriendlyMessage('AUTH_INVALID_CREDENTIALS');
// Returns: "Invalid email or password"
```

### isAuthError

Check if error is an authentication error.

```tsx
import { isAuthError } from '../utils/errorHandler';

if (isAuthError(error)) {
  // Redirect to login
  navigate('/login');
}
```

### isValidationError

Check if error is a validation error.

```tsx
import { isValidationError, getValidationErrors } from '../utils/errorHandler';

if (isValidationError(error)) {
  const errors = getValidationErrors(error);
  // errors = { email: 'Invalid email', password: 'Too short' }
}
```

## Custom Hook: useErrorHandler

Simplified error handling with automatic toast notifications.

**Usage:**
```tsx
import { useErrorHandler } from '../hooks/useErrorHandler';

function MyComponent() {
  const { handleError } = useErrorHandler();

  const fetchData = async () => {
    try {
      const response = await api.get('/data');
      setData(response.data);
    } catch (error) {
      handleError(error); // Automatically shows toast and handles auth errors
    }
  };

  // With custom message
  const saveData = async () => {
    try {
      await api.post('/data', data);
    } catch (error) {
      handleError(error, 'Failed to save your changes');
    }
  };
}
```

**Features:**
- Automatically shows error toast
- Redirects to login for auth errors
- Logs errors in development
- Supports custom error messages

## API Error Response Format

All API errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "Missing required fields",
    "details": {
      "missingFields": ["email", "password"]
    }
  }
}
```

## Error Codes

Common error codes and their user-friendly messages:

| Code | Message |
|------|---------|
| `AUTH_INVALID_CREDENTIALS` | Invalid email or password |
| `AUTH_TOKEN_EXPIRED` | Your session has expired. Please log in again. |
| `AUTH_UNAUTHORIZED` | You must be logged in to access this resource. |
| `VALIDATION_FAILED` | Please check your input and try again. |
| `INVALID_FILE_TYPE` | Invalid file type. Please upload a PDF or DOCX file. |
| `FILE_TOO_LARGE` | File is too large. Maximum size is 10MB. |
| `RESUME_NOT_FOUND` | Resume not found. |
| `RATE_LIMIT_EXCEEDED` | Too many requests. Please wait a moment and try again. |

## Best Practices

### 1. Always Handle Errors

```tsx
// ❌ Bad
const fetchData = async () => {
  const response = await api.get('/data');
  setData(response.data);
};

// ✅ Good
const fetchData = async () => {
  try {
    const response = await api.get('/data');
    setData(response.data);
  } catch (error) {
    handleError(error);
  }
};
```

### 2. Show Success Feedback

```tsx
// ✅ Good
const saveData = async () => {
  try {
    await api.post('/data', data);
    showSuccess('Data saved successfully!');
  } catch (error) {
    handleError(error);
  }
};
```

### 3. Use Loading States

```tsx
const [isLoading, setIsLoading] = useState(false);

const fetchData = async () => {
  setIsLoading(true);
  try {
    const response = await api.get('/data');
    setData(response.data);
  } catch (error) {
    handleError(error);
  } finally {
    setIsLoading(false);
  }
};
```

### 4. Validate Before Submitting

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  // Client-side validation
  if (!email) {
    showError('Email is required');
    return;
  }
  
  if (!validateEmail(email)) {
    showError('Please enter a valid email');
    return;
  }
  
  // Submit
  try {
    await api.post('/submit', { email });
    showSuccess('Submitted successfully!');
  } catch (error) {
    handleError(error);
  }
};
```

### 5. Handle Specific Errors

```tsx
try {
  await api.post('/data', data);
} catch (error) {
  if (isAuthError(error)) {
    showError('Please log in to continue');
    navigate('/login');
  } else if (isValidationError(error)) {
    const errors = getValidationErrors(error);
    setFormErrors(errors);
  } else {
    handleError(error);
  }
}
```

## Example: Complete Form with Error Handling

```tsx
import React, { useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { useErrorHandler } from '../hooks/useErrorHandler';
import FormError from '../components/FormError';
import api from '../lib/api';

const MyForm: React.FC = () => {
  const { showSuccess } = useToast();
  const { handleError } = useErrorHandler();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (value: string): boolean => {
    if (!value) {
      setEmailError('Email is required');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setEmailError('Invalid email format');
      return false;
    }
    setEmailError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/submit', { email });
      showSuccess('Form submitted successfully!');
      setEmail('');
    } catch (error) {
      handleError(error, 'Failed to submit form');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => validateEmail(email)}
          className={emailError ? 'border-red-500' : ''}
        />
        <FormError message={emailError} />
      </div>

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default MyForm;
```

## Testing Error Handling

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ToastProvider } from '../contexts/ToastContext';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should show error toast on API failure', async () => {
    // Mock API to throw error
    jest.spyOn(api, 'post').mockRejectedValue(new Error('API Error'));

    render(
      <ToastProvider>
        <MyComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
```
