/**
 * Script to deactivate a specific template from the database
 * 
 * Usage: npx ts-node scripts/delete-template.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Deactivate a template by ID (soft delete)
 */
async function main() {
  try {
    const result = await prisma.template.update({
      where: { id: '526bacfa-dcd9-41ef-9312-1bd4711027ca' },
      data: { isActive: false },
    });
    console.log('✅ Deactivated template:', result.name);
  } catch (error) {
    console.error('❌ Failed to deactivate template:', error);
    throw error;
  }
}

main()
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
