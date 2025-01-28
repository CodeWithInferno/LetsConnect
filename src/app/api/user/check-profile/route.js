// import prisma from '@/lib/prisma';
// import { getSession } from '@auth0/nextjs-auth0';

// export async function GET(req) {
//   const session = await getSession(req);

//   if (!session?.user) {
//     return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
//   }

//   const userEmail = session.user.email;
//   const user = await prisma.user.findUnique({
//     where: { email: userEmail },
//   });

//   if (!user || !user.name || !user.number || !user.profile_picture) {
//     return new Response(JSON.stringify({ onboardingNeeded: true }));
//   }

//   return new Response(JSON.stringify({ onboardingNeeded: false }));
// }







import prisma from '@/lib/prisma';
import { getSession } from '@auth0/nextjs-auth0';

export async function GET(req) {
  const session = await getSession(req);

  if (!session?.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  const userEmail = session.user.email;
  const user = await prisma.user.findUnique({
    where: { email: userEmail },
  });

  if (!user || !user.name || !user.number || !user.profile_picture || !user.role || !user.timezone) {
    return new Response(JSON.stringify({ onboardingNeeded: true }));
  }

  return new Response(JSON.stringify({ onboardingNeeded: false }));
}
