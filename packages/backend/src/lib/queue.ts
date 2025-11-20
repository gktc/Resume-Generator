import Bull, { Queue } from 'bull';
import { createClient } from 'redis';

// Redis client configuration
const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
};

// Create resume generation queue
export const resumeQueue: Queue = new Bull('resume-generation', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
    timeout: 120000, // 2 minutes timeout
    removeOnComplete: 100, // Keep last 100 completed jobs
    removeOnFail: 200, // Keep last 200 failed jobs
  },
});

// Queue event handlers
resumeQueue.on('error', (error) => {
  console.error('❌ Resume queue error:', error);
});

resumeQueue.on('waiting', (jobId) => {
  console.log(`⏳ Job ${jobId} is waiting`);
});

resumeQueue.on('active', (job) => {
  console.log(`🔄 Job ${job.id} is now active`);
});

resumeQueue.on('completed', (job) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

resumeQueue.on('failed', (job, error) => {
  console.error(`❌ Job ${job?.id} failed:`, error.message);
});

resumeQueue.on('stalled', (job) => {
  console.warn(`⚠️ Job ${job.id} has stalled`);
});

/**
 * Get queue statistics including job counts by status
 * @returns Object containing queue statistics
 */
export const getQueueStats = async () => {
  const [waiting, active, completed, failed, delayed] = await Promise.all([
    resumeQueue.getWaitingCount(),
    resumeQueue.getActiveCount(),
    resumeQueue.getCompletedCount(),
    resumeQueue.getFailedCount(),
    resumeQueue.getDelayedCount(),
  ]);

  return {
    waiting,
    active,
    completed,
    failed,
    delayed,
    total: waiting + active + completed + failed + delayed,
  };
};

/**
 * Get detailed status information for a specific job
 * @param jobId - The unique identifier of the job
 * @returns Job status object or null if job not found
 */
export const getJobStatus = async (jobId: string) => {
  const job = await resumeQueue.getJob(jobId);

  if (!job) {
    return null;
  }

  const state = await job.getState();
  const progress = job.progress();
  const failedReason = job.failedReason;
  const returnValue = job.returnvalue;

  return {
    id: job.id,
    state,
    progress,
    data: job.data,
    failedReason,
    result: returnValue,
    attemptsMade: job.attemptsMade,
    processedOn: job.processedOn,
    finishedOn: job.finishedOn,
  };
};

/**
 * Clean up old completed and failed jobs from the queue
 * Removes completed jobs older than 24 hours and failed jobs older than 7 days
 */
export const cleanQueue = async () => {
  await resumeQueue.clean(24 * 3600 * 1000, 'completed'); // Clean completed jobs older than 24 hours
  await resumeQueue.clean(7 * 24 * 3600 * 1000, 'failed'); // Clean failed jobs older than 7 days
};

/**
 * Gracefully close the queue connection
 * Should be called during application shutdown
 */
export const closeQueue = async () => {
  await resumeQueue.close();
  console.log('📪 Resume queue closed');
};

/**
 * Test Redis connection to verify configuration
 * @returns True if connection successful, false otherwise
 */
export const testRedisConnection = async (): Promise<boolean> => {
  try {
    const client = createClient({
      socket: {
        host: redisConfig.host,
        port: redisConfig.port,
      },
      password: redisConfig.password,
    });

    await client.connect();
    await client.ping();
    await client.disconnect();

    console.log('✅ Redis connection successful');
    return true;
  } catch (error) {
    console.error('❌ Redis connection failed:', error);
    return false;
  }
};
