import { useCallback } from 'react';
import { useToast } from '../contexts/ToastContext';
import { getErrorMessage, getUserFriendlyMessage, isAuthError } from '../utils/errorHandler';
import { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

/**
 * Hook for handling errors with toast notifications
 */
export const useErrorHandler = () => {
  const { showError } = useToast();
  const navigate = useNavigate();

  const handleError = useCallback(
    (error: unknown, customMessage?: string) => {
      // Check if it's an auth error and redirect to login
      if (isAuthError(error)) {
        showError('Your session has expired. Please log in again.');
        navigate('/login');
        return;
      }

      // Get error message
      let message = customMessage || getErrorMessage(error);

      // Try to get user-friendly message from error code
      if (error instanceof AxiosError && error.response?.data?.error?.code) {
        const friendlyMessage = getUserFriendlyMessage(error.response.data.error.code);
        if (friendlyMessage !== 'An unexpected error occurred') {
          message = friendlyMessage;
        }
      }

      // Show error toast
      showError(message);

      // Log error in development
      if (import.meta.env.DEV) {
        console.error('Error handled:', error);
      }
    },
    [showError, navigate]
  );

  return { handleError };
};
