/**
 * Utility script to check resume files in the database and filesystem
 * 
 * This script verifies that completed resumes have their corresponding PDF files
 * and reports any discrepancies between database records and actual files.
 * 
 * Usage: npx ts-node check-resume-files.ts
 */

import { PrismaClient } from '@prisma/client';
import fs from 'fs/promises';
import path from 'path';

const prisma = new PrismaClient();

/**
 * Check resume files in database and verify their existence on filesystem
 */
async function checkResumeFiles(): Promise<void> {
  console.log('📋 Checking resume files...\n');

  try {
    // Fetch recent completed resumes
    const resumes = await prisma.resume.findMany({
      where: {
        status: 'completed',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      include: {
        jobDescription: true,
      },
    });

    console.log(`Found ${resumes.length} completed resumes:\n`);

    // Check each resume file
    for (const resume of resumes) {
      console.log(`Resume ID: ${resume.id}`);
      console.log(`  File Name: ${resume.fileName}`);
      console.log(`  File Path: ${resume.filePath}`);
      console.log(`  Status: ${resume.status}`);
      console.log(`  Job: ${resume.jobDescription.position} at ${resume.jobDescription.company}`);

      // Check if file exists at stored path
      try {
        await fs.access(resume.filePath);
        const stats = await fs.stat(resume.filePath);
        console.log(`  ✅ File exists (${Math.round(stats.size / 1024)} KB)`);
      } catch (error) {
        console.log(`  ❌ File NOT found at: ${resume.filePath}`);

        // Check if file exists in uploads/resumes directory
        const uploadsPath = path.join(process.cwd(), 'uploads', 'resumes', resume.fileName);
        try {
          await fs.access(uploadsPath);
          const stats = await fs.stat(uploadsPath);
          console.log(`  ⚠️  But found at: ${uploadsPath} (${Math.round(stats.size / 1024)} KB)`);
        } catch {
          console.log(`  ❌ Also not found at: ${uploadsPath}`);
        }
      }
      console.log('');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Execute the check
checkResumeFiles();
