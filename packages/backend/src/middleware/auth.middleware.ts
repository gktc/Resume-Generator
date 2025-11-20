import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken, TokenPayload } from '../utils/jwt';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token and attaches user to request
 * Handles token expiration with specific error codes
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_MISSING',
          message: 'Authentication token is required',
        },
      });
      return;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Verify token
    try {
      const payload = verifyAccessToken(token);
      req.user = payload;
      next();
    } catch (error) {
      // Handle specific JWT errors
      if (error instanceof jwt.TokenExpiredError) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_TOKEN_EXPIRED',
            message: 'Token has expired. Please refresh your token.',
            details: {
              expiredAt: error.expiredAt,
            },
          },
        });
        return;
      }

      if (error instanceof jwt.JsonWebTokenError) {
        res.status(401).json({
          success: false,
          error: {
            code: 'AUTH_TOKEN_INVALID',
            message: 'Invalid token format or signature',
          },
        });
        return;
      }

      // Generic token error
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_TOKEN_INVALID',
          message: 'Invalid or expired token',
        },
      });
      return;
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An error occurred during authentication',
      },
    });
    return;
  }
}

/**
 * Optional authentication middleware
 * Attaches user if token is present, but doesn't require it
 */
export function optionalAuthenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const payload = verifyAccessToken(token);
        req.user = payload;
      } catch (error) {
        // Token is invalid, but we don't fail the request
        req.user = undefined;
      }
    }
    next();
  } catch (error) {
    next();
  }
}

/**
 * Middleware to require authenticated user
 * Similar to authenticate but with clearer error message
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: {
        code: 'AUTH_UNAUTHORIZED',
        message: 'You must be logged in to access this resource',
      },
    });
    return;
  }
  next();
}

/**
 * Middleware to validate user owns the resource
 * Checks if the userId in the request matches the authenticated user
 */
export function requireOwnership(userIdParam: string = 'userId') {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: {
          code: 'AUTH_UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
      return;
    }

    const resourceUserId = req.params[userIdParam] || req.body[userIdParam];
    
    if (!resourceUserId) {
      res.status(400).json({
        success: false,
        error: {
          code: 'VALIDATION_FAILED',
          message: `Missing ${userIdParam} parameter`,
        },
      });
      return;
    }

    if (req.user.userId !== resourceUserId) {
      res.status(403).json({
        success: false,
        error: {
          code: 'AUTH_FORBIDDEN',
          message: 'You do not have permission to access this resource',
        },
      });
      return;
    }

    next();
  };
}
