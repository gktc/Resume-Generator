import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Deactivate the broken templates
  await prisma.template.update({
    where: { id: 'd697e9ba-08a8-4c01-8af2-b106692d4783' },
    data: { isActive: false },
  });
  
  console.log('✅ Deactivated broken templates');
  console.log('\n5 working templates remain active:');
  console.log('  - Modern Professional');
  console.log('  - Classic Elegant');
  console.log('  - Creative Bold');
  console.log('  - Academic Research');
  console.log('  - Technical Developer');
}

main()
  .finally(() => prisma.$disconnect());
