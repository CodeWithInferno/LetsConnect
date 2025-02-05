import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    // 1. Check Auth Session
    const session = await getSession();
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized. Please log in.' }), { status: 401 });
    }

    const userEmail = session.user.email;

    // 2. Parse request body
    const {
      title,
      description,
      projectType,
      skillsRequired = [],
      languages = [],
      deadline,
      budget,
      certificateEligible = false,
      bannerImage,
      githubRepo,
    } = await req.json();

    // 3. Validate required fields
    if (!title || !description || !projectType || !githubRepo) {
      return new Response(
        JSON.stringify({ error: 'Title, description, project type, and GitHub repository are required.' }),
        { status: 400 }
      );
    }

    // 4. Find the User & Organization
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        organizations: {
          include: { organization: true },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found.' }), { status: 404 });
    }

    const userOrganization = user.organizations[0]?.organization;
    if (!userOrganization) {
      return new Response(JSON.stringify({ error: 'Organization not found for the user.' }), { status: 404 });
    }

    // 5. Process skillsRequired (Check existing or create new)
    const processedSkills = await Promise.all(
      skillsRequired.map(async (skillName) => {
        let skill = await prisma.skill.findUnique({ where: { name: skillName } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName, isCustom: true } });
        }
        return { id: skill.id };
      })
    );

    // 6. Process languages (Check existing or create new)
    const processedLanguages = await Promise.all(
      languages.map(async (langName) => {
        let language = await prisma.programmingLanguage.findUnique({ where: { name: langName } });
        if (!language) {
          language = await prisma.programmingLanguage.create({ data: { name: langName } });
        }
        return { id: language.id };
      })
    );

    // 7. Create the Project
    const project = await prisma.project.create({
      data: {
        title,
        description,
        projectType,
        email: userEmail,
        ownerId: user.id,
        organizationId: userOrganization.id,
        deadline: deadline ? new Date(deadline) : null,
        budget: budget ? parseFloat(budget) : null,
        certificateEligible,
        bannerImage: bannerImage || null,
        githubRepo,
        createdAt: new Date(),
        updatedAt: new Date(),

        // ✅ Connect existing or newly created skills
        skillsRequired: { connect: processedSkills },

        // ✅ Connect existing or newly created languages
        languages: { connect: processedLanguages },

        // Insert the owner as a project member
        members: {
          create: [
            {
              user: { connect: { id: user.id } },
              role: 'OWNER',
              status: 'ACTIVE',
            },
          ],
        },
      },
      include: { members: true },
    });

    // 8. Initialize a default Kanban board for the project
    await prisma.kanbanBoard.create({
      data: {
        projectId: project.id,
        columns: {
          create: [
            { title: 'To Do', color: '#6366F1', order: 1 },
            { title: 'In Progress', color: '#EC4899', order: 2 },
            { title: 'Done', color: '#10B981', order: 3 },
          ],
        },
      },
    });

    return new Response(JSON.stringify({ success: true, project }), { status: 201 });
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
