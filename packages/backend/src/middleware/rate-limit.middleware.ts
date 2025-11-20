import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

/**
 * Rate limit error handler
 * Returns consistent error response format when rate limit is exceeded
 */
const rateLimitHandler = (_req: Request, res: Response): void => {
  res.status(429).json({
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests. Please try again later.',
    },
  });
};

/**
 * General API rate limiter
 * Limits: 100 requests per 15 minutes per IP
 */
export const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Strict rate limiter for authentication endpoints
 * Limits: 50 requests per 15 minutes per IP (relaxed for development)
 * Prevents brute force attacks on login/register
 * TODO: Change max to 5 for production
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Relaxed for development (use 5 in production)
  message: 'Too many authentication attempts. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for expensive operations (resume generation, AI calls)
 * Limits: 10 requests per hour per IP
 */
export const expensiveOperationRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many generation requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Rate limiter for file uploads
 * Limits: 20 uploads per hour per IP
 */
export const uploadRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many file uploads. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

/**
 * Rate limiter for job analysis
 * Limits: 30 requests per hour per IP
 */
export const analysisRateLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30,
  message: 'Too many analysis requests. Please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: rateLimitHandler,
});

