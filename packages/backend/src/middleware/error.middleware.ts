import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';
import { Prisma } from '@prisma/client';

/**
 * Error response format
 */
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
    stack?: string;
  };
}

/**
 * Global error handler middleware
 * Catches all errors and formats them consistently
 */
export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Default error values
  let statusCode = 500;
  let code = 'INTERNAL_ERROR';
  let message = 'An internal server error occurred';
  let details: any = undefined;

  // Handle operational errors (AppError instances)
  if (err instanceof AppError) {
    statusCode = err.statusCode;
    code = err.code;
    message = err.message;
    details = err.details;

    // Log operational errors at appropriate level
    if (statusCode >= 500) {
      logger.error('Operational error', err, {
        path: req.path,
        method: req.method,
        userId: req.user?.userId,
      });
    } else {
      logger.warn('Client error', {
        code,
        message,
        path: req.path,
        method: req.method,
        userId: req.user?.userId,
      });
    }
  }
  // Handle Prisma database errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 500;
    code = 'DATABASE_ERROR';

    // Handle specific Prisma error codes
    switch (err.code) {
      case 'P2002':
        // Unique constraint violation
        statusCode = 409;
        code = 'CONFLICT';
        message = 'A record with this value already exists';
        details = { field: err.meta?.target };
        break;
      case 'P2025':
        // Record not found
        statusCode = 404;
        code = 'RESOURCE_NOT_FOUND';
        message = 'The requested resource was not found';
        break;
      case 'P2003':
        // Foreign key constraint violation
        statusCode = 400;
        code = 'VALIDATION_FAILED';
        message = 'Invalid reference to related resource';
        break;
      default:
        message = 'Database operation failed';
    }

    logger.error('Database error', err, {
      prismaCode: err.code,
      path: req.path,
      method: req.method,
    });
  }
  // Handle Prisma validation errors
  else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    code = 'VALIDATION_FAILED';
    message = 'Invalid data provided';

    logger.error('Validation error', err, {
      path: req.path,
      method: req.method,
    });
  }
  // Handle JWT errors
  else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'AUTH_TOKEN_INVALID';
    message = 'Invalid authentication token';

    logger.warn('JWT error', {
      message: err.message,
      path: req.path,
      method: req.method,
    });
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'AUTH_TOKEN_EXPIRED';
    message = 'Authentication token has expired';

    logger.warn('Token expired', {
      path: req.path,
      method: req.method,
    });
  }
  // Handle Multer file upload errors
  else if (err.name === 'MulterError') {
    statusCode = 400;
    code = 'FILE_UPLOAD_ERROR';

    const multerErr = err as any;
    switch (multerErr.code) {
      case 'LIMIT_FILE_SIZE':
        code = 'FILE_TOO_LARGE';
        message = 'File size exceeds the maximum limit';
        break;
      case 'LIMIT_FILE_COUNT':
        message = 'Too many files uploaded';
        break;
      case 'LIMIT_UNEXPECTED_FILE':
        message = 'Unexpected file field';
        break;
      default:
        message = 'File upload failed';
    }

    logger.warn('File upload error', {
      code: multerErr.code,
      path: req.path,
      method: req.method,
    });
  }
  // Handle unexpected errors
  else {
    logger.error('Unexpected error', err, {
      path: req.path,
      method: req.method,
      userId: req.user?.userId,
    });
  }

  // Build error response
  const errorResponse: ErrorResponse = {
    success: false,
    error: {
      code,
      message,
      ...(details && { details }),
      // Include stack trace in development
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  };

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Async handler wrapper to catch errors in async route handlers
 * Usage: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

/**
 * 404 Not Found handler
 * Should be placed before the error handler
 */
export const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`,
    },
  });
};
