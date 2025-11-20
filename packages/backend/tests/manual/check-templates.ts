import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTemplates() {
  console.log('📋 Checking existing templates...\n');

  try {
    const templates = await prisma.template.findMany({
      select: {
        id: true,
        name: true,
        category: true,
        latexContent: true,
      },
    });

    console.log(`Found ${templates.length} templates:\n`);

    templates.forEach((template, index) => {
      console.log(`${index + 1}. ${template.name} (${template.category})`);
      console.log(`   ID: ${template.id}`);
      console.log(`   LaTeX content preview (first 200 chars):`);
      console.log(`   ${template.latexContent.substring(0, 200)}...`);
      console.log(`   Has {{content}} placeholder: ${template.latexContent.includes('{{content}}')}`);
      console.log(`   Has {{name}} placeholder: ${template.latexContent.includes('{{name}}')}`);
      console.log(`   Has {{experience}} placeholder: ${template.latexContent.includes('{{experience}}')}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Error checking templates:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkTemplates();
