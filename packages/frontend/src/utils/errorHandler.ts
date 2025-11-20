import { AxiosError } from 'axios';

export interface ApiError {
  code: string;
  message: string;
  details?: any;
}

/**
 * Extract error message from API error response
 */
export const getErrorMessage = (error: unknown): string => {
  // Handle Axios errors
  if (error instanceof AxiosError) {
    // Check if response has error data
    if (error.response?.data?.error) {
      const apiError = error.response.data.error as ApiError;
      return apiError.message || 'An error occurred';
    }

    // Handle network errors
    if (error.code === 'ERR_NETWORK') {
      return 'Network error. Please check your connection.';
    }

    // Handle timeout errors
    if (error.code === 'ECONNABORTED') {
      return 'Request timeout. Please try again.';
    }

    // Handle other HTTP errors
    if (error.response) {
      switch (error.response.status) {
        case 400:
          return 'Invalid request. Please check your input.';
        case 401:
          return 'Authentication required. Please log in.';
        case 403:
          return 'Access forbidden. You do not have permission.';
        case 404:
          return 'Resource not found.';
        case 409:
          return 'Conflict. The resource already exists.';
        case 429:
          return 'Too many requests. Please try again later.';
        case 500:
          return 'Server error. Please try again later.';
        default:
          return 'An unexpected error occurred.';
      }
    }

    // Fallback for Axios errors
    return error.message || 'An error occurred';
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return error.message;
  }

  // Handle string errors
  if (typeof error === 'string') {
    return error;
  }

  // Fallback for unknown errors
  return 'An unexpected error occurred';
};

/**
 * Get user-friendly error message based on error code
 */
export const getUserFriendlyMessage = (code: string): string => {
  const messages: Record<string, string> = {
    // Authentication errors
    AUTH_INVALID_CREDENTIALS: 'Invalid email or password',
    AUTH_TOKEN_EXPIRED: 'Your session has expired. Please log in again.',
    AUTH_TOKEN_INVALID: 'Invalid authentication token. Please log in again.',
    AUTH_UNAUTHORIZED: 'You must be logged in to access this resource.',
    USER_EXISTS: 'An account with this email already exists.',
    USER_NOT_FOUND: 'User not found.',

    // Validation errors
    VALIDATION_FAILED: 'Please check your input and try again.',
    INVALID_FILE_TYPE: 'Invalid file type. Please upload a PDF or DOCX file.',
    FILE_TOO_LARGE: 'File is too large. Maximum size is 10MB.',
    INVALID_DATE_RANGE: 'Start date must be before end date.',

    // Resource errors
    RESOURCE_NOT_FOUND: 'The requested resource was not found.',
    RESUME_NOT_FOUND: 'Resume not found.',

    // Processing errors
    RESUME_PARSE_FAILED: 'Failed to parse resume. Please try a different file.',
    LATEX_COMPILATION_FAILED: 'Failed to generate resume. Please try again.',
    AI_SERVICE_ERROR: 'AI service is temporarily unavailable. Please try again.',
    DATABASE_ERROR: 'Database error. Please try again later.',
    QUEUE_ERROR: 'Job queue error. Please try again.',

    // Rate limiting
    RATE_LIMIT_EXCEEDED: 'Too many requests. Please wait a moment and try again.',

    // General errors
    INTERNAL_ERROR: 'An internal error occurred. Please try again.',
    ROUTE_NOT_FOUND: 'The requested endpoint does not exist.',
  };

  return messages[code] || 'An unexpected error occurred';
};

/**
 * Check if error is an authentication error
 */
export const isAuthError = (error: unknown): boolean => {
  if (error instanceof AxiosError && error.response?.data?.error) {
    const code = error.response.data.error.code;
    return (
      code === 'AUTH_INVALID_CREDENTIALS' ||
      code === 'AUTH_TOKEN_EXPIRED' ||
      code === 'AUTH_TOKEN_INVALID' ||
      code === 'AUTH_UNAUTHORIZED'
    );
  }
  return false;
};

/**
 * Check if error is a validation error
 */
export const isValidationError = (error: unknown): boolean => {
  if (error instanceof AxiosError && error.response?.data?.error) {
    const code = error.response.data.error.code;
    return code === 'VALIDATION_FAILED';
  }
  return false;
};

/**
 * Get validation error details
 */
export const getValidationErrors = (error: unknown): Record<string, string> | null => {
  if (error instanceof AxiosError && error.response?.data?.error) {
    const apiError = error.response.data.error as ApiError;
    if (apiError.code === 'VALIDATION_FAILED' && apiError.details) {
      return apiError.details;
    }
  }
  return null;
};

/**
 * Format error for display
 */
export const formatError = (error: unknown): { title: string; message: string } => {
  if (error instanceof AxiosError && error.response?.data?.error) {
    const apiError = error.response.data.error as ApiError;
    return {
      title: getUserFriendlyMessage(apiError.code),
      message: apiError.message,
    };
  }

  return {
    title: 'Error',
    message: getErrorMessage(error),
  };
};
