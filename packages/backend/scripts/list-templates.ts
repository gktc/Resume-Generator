/**
 * List all templates in the database
 * 
 * Usage: npx ts-node packages/backend/scripts/list-templates.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const templates = await prisma.template.findMany();
  console.log('\nAll Templates:');
  templates.forEach((t) => {
    console.log(`${t.isActive ? '✅' : '❌'} ${t.name} (${t.id})`);
  });
}

main()
  .then(() => {
    console.log('\n✅ Done');
  })
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
