import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized. Please log in.' }),
        { status: 401 }
      );
    }

    const userEmail = session.user.email;

    // Parse the request body
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
    } = await req.json();

    if (!title || !description || !projectType) {
      return new Response(
        JSON.stringify({
          error: 'Title, description, and project type are required.',
        }),
        { status: 400 }
      );
    }

    // Fetch the user
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

    // Fetch the organization linked to the user
    const userOrganization = user.organizations[0]?.organization; // Assuming the user has only one organization

    if (!userOrganization) {
      return new Response(
        JSON.stringify({ error: 'Organization not found for the user.' }),
        { status: 404 }
      );
    }

    // Create the project
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
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    return new Response(
      JSON.stringify({ success: true, project }),
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
