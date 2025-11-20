import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const template = await prisma.template.findFirst({
    where: { name: 'Modern Professional' },
  });
  
  if (template) {
    console.log('Template:', template.name);
    console.log('\nLatex Content (first 500 chars):');
    console.log(template.latexContent.substring(0, 500));
  }
}

main().finally(() => prisma.$disconnect());
