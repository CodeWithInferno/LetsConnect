// // prisma/seed.js
// const { PrismaClient } = require('@prisma/client');
// const prisma = new PrismaClient();

// const predefinedSkills = [
//   'React',
//   'Python',
//   'UI/UX',
//   'Blockchain',
//   'TypeScript',
//   'Machine Learning',
// ];

// async function main() {
//   // Clear old data if needed (optional)
//   // await prisma.userSkill.deleteMany();
//   // await prisma.skill.deleteMany();

//   // Create predefined skills
//   await prisma.skill.createMany({
//     data: predefinedSkills.map((name) => ({
//       name,
//       isCustom: false,
//     })),
//     skipDuplicates: true, // don't error if it already exists
//   });

//   console.log('✅ Seed completed');
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seed failed', e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });

// prisma/seed.js
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  // 1) Create or skip 10 test users
  const testUsers = Array.from({ length: 10 }, (_, i) => ({
    name: `User #${i + 1}`,
    username: `testuser${i + 1}`,
    email: `testuser${i + 1}@example.com`,
    role: "MEMBER",
    bio: `Hello, I'm Test User ${i + 1}`,
    website: `https://example.com/testuser${i + 1}`,
    location: "N/A",
    profile_picture: null,
  }));

  await prisma.user.createMany({
    data: testUsers,
    skipDuplicates: true, // won't error if "testuserX" already exists
  });

  console.log("✅ Seeded or skipped 10 test users!");

  // 2) Create or skip 5 organizations
  const orgData = [
    {
      name: "Rocket Labs",
      slug: "rocket-labs",
      logo: "https://placehold.co/100x100?text=RocketLabs",
    },
    {
      name: "SkyNet Tech",
      slug: "skynet-tech",
      logo: "https://placehold.co/100x100?text=SkyNet",
    },
    {
      name: "CodeSmiths",
      slug: "codesmiths",
      logo: "https://placehold.co/100x100?text=CodeSmiths",
    },
    {
      name: "DevUnited",
      slug: "devunited",
      logo: "https://placehold.co/100x100?text=DevUnited",
    },
    {
      name: "NextLevel AI",
      slug: "nextlevel-ai",
      logo: "https://placehold.co/100x100?text=NextLevelAI",
    },
  ];

  await prisma.organization.createMany({
    data: orgData,
    skipDuplicates: true, // won't error if org with same slug already exists
  });

  console.log("✅ Seeded or skipped 5 organizations!");

  // 3) Get all users (including the newly created ones)
  const allUsers = await prisma.user.findMany();

  // 4) Create 5 projects with random owners, skipping duplicates by title
  const projectTitles = [
    "Alpha Launch",
    "Beta Builders",
    "Gamma Gears",
    "Delta Dev",
    "Epsilon Endeavor",
  ];
  // Some random banners:
  const projectBanners = [
    "https://source.unsplash.com/random/800x400/?tech",
    "https://source.unsplash.com/random/800x400/?office",
    "https://source.unsplash.com/random/800x400/?programming",
    "https://placehold.co/800x400?text=ProjectBanner",
  ];

  function randomItem(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  // We'll do createMany for the projects, but we need to map them with random owners
  // If you want to skip duplicates by title, add "title" as a unique field in your model
  // or handle them in a try/catch
  const projectsToCreate = projectTitles.map((title, i) => {
    // pick random user from allUsers
    const randomOwner = randomItem(allUsers);
    // random date
    const someDate = new Date(
      2025,
      Math.floor(Math.random() * 12),
      Math.floor(Math.random() * 28) + 1
    );

    return {
      id: undefined, // let Prisma set the uuid
      title,
      description: `A sample project called ${title}.`,
      ownerId: randomOwner.id,
      bannerImage: randomItem(projectBanners),
      deadline: someDate,
      email: `contact+${title.toLowerCase().replace(/\s+/g, "")}@example.com`,
      projectType: "OPEN_SOURCE",
      githubRepo: "https://github.com/example/fake",
      certificateEligible: Math.random() < 0.5,
    };
  });

  // createMany doesn't allow relations. That's fine if we only need to set "ownerId".
  // If "title" is unique, skipDuplicates can help. Otherwise, handle it in a try/catch.
  try {
    await prisma.project.createMany({
      data: projectsToCreate,
      skipDuplicates: true,
    });
    console.log("✅ Seeded (or skipped) 5 projects!");
  } catch (err) {
    console.error("❌ Error creating projects:", err.message);
  }

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Error while seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
