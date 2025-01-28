import prisma from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
  const session = await getSession(req);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // If you store which organization the user belongs to in 'user.organizationId',
  // or if you store organization in some other way, adapt accordingly:
  // For demonstration, let's assume we check if the user has an org with all fields set.

  const userEmail = session.user.email;
  const user = await prisma.user.findUnique({ where: { email: userEmail } });

  // If we have "organizationId" in the user record or something:
  if (!user || !user.organizationId) {
    return new Response(JSON.stringify({ onboardingNeeded: true }));
  }

  const organization = await prisma.organization.findUnique({
    where: { id: user.organizationId },
  });

  // Check essential fields are set
  if (!organization || !organization.slug || !organization.logo || !organization.industry) {
    return new Response(JSON.stringify({ onboardingNeeded: true }));
  }

  return new Response(JSON.stringify({ onboardingNeeded: false }));
}
