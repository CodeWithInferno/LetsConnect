import prisma from '../lib/prisma';

async function main() {
  await prisma.user.create({
    data: {
      email: 'testuser@example.com',
      name: 'Test User',
      number: '1234567890',
      profile_picture: 'https://via.placeholder.com/150',
      role: 'Contributor',
    },
  });

  console.log('User created');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
