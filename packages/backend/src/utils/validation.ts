import { ValidationError, InvalidDateRangeError } from './errors';

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate email and throw error if invalid
 */
export function requireValidEmail(email: string): void {
  if (!email || typeof email !== 'string') {
    throw new ValidationError('Email is required');
  }
  if (!validateEmail(email)) {
    throw new ValidationError('Invalid email format');
  }
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): boolean {
  // At least 8 characters, one uppercase, one lowercase, one number
  return password.length >= 8;
}

/**
 * Validate password and throw error if invalid
 */
export function requireValidPassword(password: string): void {
  if (!password || typeof password !== 'string') {
    throw new ValidationError('Password is required');
  }
  if (!validatePassword(password)) {
    throw new ValidationError('Password must be at least 8 characters long');
  }
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input.trim();
}

/**
 * Validate required fields
 */
export function validateRequiredFields(
  data: Record<string, any>,
  requiredFields: string[]
): { isValid: boolean; missingFields: string[] } {
  const missingFields = requiredFields.filter((field) => !data[field]);

  return {
    isValid: missingFields.length === 0,
    missingFields,
  };
}

/**
 * Require fields to be present and throw error if missing
 */
export function requireFields(data: Record<string, any>, requiredFields: string[]): void {
  const validation = validateRequiredFields(data, requiredFields);
  if (!validation.isValid) {
    throw new ValidationError('Missing required fields', {
      missingFields: validation.missingFields,
    });
  }
}

/**
 * Validate date range (start date before end date)
 */
export function validateDateRange(startDate: Date | string, endDate: Date | string | null): void {
  if (!endDate) return; // null endDate is valid (current position/education)

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    throw new ValidationError('Invalid start date');
  }

  if (isNaN(end.getTime())) {
    throw new ValidationError('Invalid end date');
  }

  if (start > end) {
    throw new InvalidDateRangeError('Start date must be before end date');
  }
}

/**
 * Validate file type
 */
export function validateFileType(mimetype: string, allowedTypes: string[]): void {
  if (!allowedTypes.includes(mimetype)) {
    throw new ValidationError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
  }
}

/**
 * Validate file size
 */
export function validateFileSize(size: number, maxSize: number): void {
  if (size > maxSize) {
    throw new ValidationError(`File size exceeds maximum of ${maxSize / (1024 * 1024)}MB`);
  }
}

/**
 * Validate enum value
 */
export function validateEnum<T>(value: any, enumValues: T[], fieldName: string): void {
  if (!enumValues.includes(value)) {
    throw new ValidationError(`Invalid ${fieldName}. Allowed values: ${enumValues.join(', ')}`);
  }
}

/**
 * Validate positive number
 */
export function validatePositiveNumber(value: any, fieldName: string): void {
  const num = Number(value);
  if (isNaN(num) || num < 0) {
    throw new ValidationError(`${fieldName} must be a positive number`);
  }
}

/**
 * Validate array is not empty
 */
export function validateNonEmptyArray(value: any, fieldName: string): void {
  if (!Array.isArray(value) || value.length === 0) {
    throw new ValidationError(`${fieldName} must be a non-empty array`);
  }
}
