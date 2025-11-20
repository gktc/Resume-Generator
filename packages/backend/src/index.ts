import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import profileRoutes from './routes/profile.routes';
import uploadRoutes from './routes/upload.routes';
import jobRoutes from './routes/job.routes';
import templateRoutes from './routes/template.routes';
import resumeRoutes from './routes/resume.routes';
import interviewRoutes from './routes/interview.routes';
import { checkDatabaseConnection } from './lib/prisma';
import { testRedisConnection } from './lib/queue';
import { errorHandler, notFoundHandler } from './middleware/error.middleware';
import { requestLogger } from './middleware/logging.middleware';
import { generalRateLimiter } from './middleware/rate-limit.middleware';
import { logger } from './utils/logger';

// Load environment variables
dotenv.config();

// Import worker to start processing resume generation jobs
import './workers/resume-generation.worker';

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware - helmet should be first
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'https:'],
      },
    },
    crossOriginEmbedderPolicy: false, // Allow embedding PDFs
  })
);

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true,
  })
);

// Request body size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// General rate limiting for all routes (disabled for development)
// app.use(generalRateLimiter);

// Request logging
app.use(requestLogger);

// Health check endpoint
app.get('/health', async (_req, res) => {
  const dbConnected = await checkDatabaseConnection();
  const redisConnected = await testRedisConnection();
  res.json({
    success: true,
    message: 'ATS Resume Builder API is running',
    database: dbConnected ? 'connected' : 'disconnected',
    redis: redisConnected ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/interview', interviewRoutes);

// 404 handler (must be after all routes)
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, async () => {
  logger.info('Server started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    url: `http://localhost:${PORT}`,
  });
  
  // Verify Redis connection for queue worker
  const redisConnected = await testRedisConnection();
  if (redisConnected) {
    logger.info('Resume generation worker is ready to process jobs');
  } else {
    logger.warn('Redis not connected - resume generation will not work');
  }
});
