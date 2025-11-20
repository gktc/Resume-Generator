import { Job } from 'bull';
import { resumeQueue } from '../lib/queue';
import { ResumeGenerationService } from '../services/resume-generation.service';
import { prisma } from '../lib/prisma';

// Job data interface
export interface ResumeGenerationJobData {
  userId: string;
  jobDescriptionId: string;
  templateId: string;
  resumeId: string;
}

// Initialize resume generation service
const resumeGenerationService = new ResumeGenerationService();

// Process resume generation jobs
resumeQueue.process(async (job: Job<ResumeGenerationJobData>) => {
  const { userId, jobDescriptionId, templateId, resumeId } = job.data;

  console.log(`🚀 Processing resume generation job ${job.id} for user ${userId}`);

  try {
    // Update job progress
    await job.progress(10);

    // Update resume status to processing
    await prisma.resume.update({
      where: { id: resumeId },
      data: { status: 'processing' },
    });

    await job.progress(20);

    // Generate the resume
    const result = await resumeGenerationService.generateResume(
      userId,
      jobDescriptionId,
      templateId,
      resumeId,
      job
    );

    await job.progress(100);

    console.log(`✅ Resume generation completed for job ${job.id}`);

    return result;
  } catch (error: any) {
    console.error(`❌ Resume generation failed for job ${job.id}:`, error);

    // Update resume status to failed
    try {
      await prisma.resume.update({
        where: { id: resumeId },
        data: { 
          status: 'failed',
        },
      });
    } catch (updateError) {
      console.error('Failed to update resume status:', updateError);
    }

    throw error;
  }
});

console.log('👷 Resume generation worker started');

// Handle graceful shutdown
process.on('SIGTERM', async () => {
  console.log('📪 Shutting down resume generation worker...');
  await resumeQueue.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('📪 Shutting down resume generation worker...');
  await resumeQueue.close();
  process.exit(0);
});
