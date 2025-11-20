/**
 * Custom error classes for the application
 */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode: number, code: string, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

// 400 Bad Request Errors
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 400, 'VALIDATION_FAILED', details);
  }
}

export class InvalidFileTypeError extends AppError {
  constructor(message: string = 'Invalid file type') {
    super(message, 400, 'INVALID_FILE_TYPE');
  }
}

export class FileTooLargeError extends AppError {
  constructor(message: string = 'File size exceeds limit') {
    super(message, 400, 'FILE_TOO_LARGE');
  }
}

export class InvalidDateRangeError extends AppError {
  constructor(message: string = 'Start date must be before end date') {
    super(message, 400, 'INVALID_DATE_RANGE');
  }
}

// 401 Unauthorized Errors
export class AuthenticationError extends AppError {
  constructor(message: string, code: string = 'AUTH_UNAUTHORIZED') {
    super(message, 401, code);
  }
}

export class InvalidCredentialsError extends AppError {
  constructor(message: string = 'Invalid email or password') {
    super(message, 401, 'AUTH_INVALID_CREDENTIALS');
  }
}

export class TokenExpiredError extends AppError {
  constructor(message: string = 'Token has expired') {
    super(message, 401, 'AUTH_TOKEN_EXPIRED');
  }
}

export class InvalidTokenError extends AppError {
  constructor(message: string = 'Invalid token') {
    super(message, 401, 'AUTH_TOKEN_INVALID');
  }
}

// 403 Forbidden Errors
export class ForbiddenError extends AppError {
  constructor(message: string = 'Access forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

// 404 Not Found Errors
export class NotFoundError extends AppError {
  constructor(resource: string, id?: string) {
    const message = id ? `${resource} with id ${id} not found` : `${resource} not found`;
    super(message, 404, 'RESOURCE_NOT_FOUND');
  }
}

export class UserNotFoundError extends AppError {
  constructor(message: string = 'User not found') {
    super(message, 404, 'USER_NOT_FOUND');
  }
}

export class ResumeNotFoundError extends AppError {
  constructor(message: string = 'Resume not found') {
    super(message, 404, 'RESUME_NOT_FOUND');
  }
}

// 409 Conflict Errors
export class ConflictError extends AppError {
  constructor(message: string, code: string = 'CONFLICT') {
    super(message, 409, code);
  }
}

export class UserExistsError extends AppError {
  constructor(message: string = 'User already exists') {
    super(message, 409, 'USER_EXISTS');
  }
}

// 429 Rate Limit Errors
export class RateLimitError extends AppError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, 'RATE_LIMIT_EXCEEDED');
  }
}

// 500 Internal Server Errors
export class InternalError extends AppError {
  constructor(message: string = 'Internal server error', code: string = 'INTERNAL_ERROR') {
    super(message, 500, code);
  }
}

export class DatabaseError extends AppError {
  constructor(message: string = 'Database operation failed') {
    super(message, 500, 'DATABASE_ERROR');
  }
}

export class ResumeParseError extends AppError {
  constructor(message: string = 'Failed to parse resume') {
    super(message, 500, 'RESUME_PARSE_FAILED');
  }
}

export class LaTeXCompilationError extends AppError {
  constructor(message: string = 'LaTeX compilation failed', details?: any) {
    super(message, 500, 'LATEX_COMPILATION_FAILED', details);
  }
}

export class AIServiceError extends AppError {
  constructor(message: string = 'AI service error', details?: any) {
    super(message, 500, 'AI_SERVICE_ERROR', details);
  }
}

export class QueueError extends AppError {
  constructor(message: string = 'Queue operation failed') {
    super(message, 500, 'QUEUE_ERROR');
  }
}
