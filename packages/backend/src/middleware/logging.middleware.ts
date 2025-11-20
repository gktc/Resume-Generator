import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

/**
 * Request logging middleware
 * Logs all incoming requests with timing information
 */
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
  const startTime = Date.now();

  // Log when response is finished
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const userId = req.user?.userId;

    logger.request(req.method, req.path, res.statusCode, duration, userId);
  });

  next();
};
