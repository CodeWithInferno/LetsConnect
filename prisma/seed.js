// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const predefinedSkills = [
  'React',
  'Python',
  'UI/UX',
  'Blockchain',
  'TypeScript',
  'Machine Learning',
];

async function main() {
  // Clear old data if needed (optional)
  // await prisma.userSkill.deleteMany();
  // await prisma.skill.deleteMany();

  // Create predefined skills
  await prisma.skill.createMany({
    data: predefinedSkills.map((name) => ({
      name,
      isCustom: false,
    })),
    skipDuplicates: true, // don't error if it already exists
  });

  console.log('✅ Seed completed');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
