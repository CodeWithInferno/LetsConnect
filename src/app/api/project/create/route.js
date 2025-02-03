import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    // 1. Check Auth Session
    const session = await getSession();
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // 2. Parse the request body
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
      githubRepo,  // New GitHub repository field
    } = await req.json();

    // 3. Validate required fields
    if (!title || !description || !projectType || !githubRepo) {
      return new Response(
        JSON.stringify({
          error:
            'Title, description, project type, and GitHub repository are required.',
        }),
        { status: 400 }
      );
    }

    // 4. Find the User & Organization
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
      include: {
        organizations: {
          include: {
            organization: true,
          },
        },
      },
    });

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'User not found.' }),
        { status: 404 }
      );
    }

    const userOrganization = user.organizations[0]?.organization;
    if (!userOrganization) {
      return new Response(
        JSON.stringify({ error: 'Organization not found for the user.' }),
        { status: 404 }
      );
    }

    // 5. Create the Project and insert the owner as a member (role: "OWNER")
    const project = await prisma.project.create({
      data: {
        title,
        description,
        projectType,
        email: userEmail,
        ownerId: user.id,
        organizationId: userOrganization.id,
        skillsRequired,
        languages,
        deadline: deadline ? new Date(deadline) : null,
        budget: budget ? parseFloat(budget) : null,
        certificateEligible,
        bannerImage: bannerImage || null,
        githubRepo,  // Include the GitHub repository field here
        createdAt: new Date(),
        updatedAt: new Date(),
        // Insert the owner as a project member with role "OWNER"
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
      include: {
        members: true,
      },
    });

    // 6. Initialize a default Kanban board for the project
    const board = await prisma.kanbanBoard.create({
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

    return new Response(
      JSON.stringify({ success: true, project, board }),
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating project:', error);
    return new Response(
      JSON.stringify({ error: 'Internal Server Error' }),
      { status: 500 }
    );
  }
}
