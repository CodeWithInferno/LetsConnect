import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function GET(req) {
  try {
    const session = await getSession(); // Get session from Auth0
    if (!session?.user) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
      });
    }

    const userEmail = session.user.email;

    // Fetch organizations the user is a part of
    const organizations = await prisma.organizationMember.findMany({
      where: {
        user: {
          email: userEmail,
        },
      },
      include: {
        organization: true, // Include organization details
      },
    });

    const formattedOrganizations = organizations.map((member) => ({
      id: member.organization.id,
      name: member.organization.name,
    }));

    return new Response(JSON.stringify({ organizations: formattedOrganizations }), {
      status: 200,
    });
  } catch (error) {
    console.error('Error fetching organizations:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
    });
  }
}
