const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const predefinedSkills = [
  'React',
  'Python',
  'UI/UX',
  'Blockchain',
  'TypeScript',
  'Machine Learning'
];

async function main() {
  // Clean existing data
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();

  // Create predefined skills
  await prisma.skill.createMany({
    data: predefinedSkills.map(name => ({
      name,
      isCustom: false
    })),
    skipDuplicates: true
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });