// // app/projects/new/page.js
// import { getSession } from '@auth0/nextjs-auth0';
// import { redirect } from 'next/navigation';
// import prisma from '@/lib/prisma';
// import ProjectForm from "@/components/projects/ProjectForm"

// export default async function NewProjectPage() {
//   // Get Auth0 session
//   const session = await getSession();
  
//   // Redirect to login if not authenticated
//   if (!session?.user) {
//     redirect('/api/auth/login');
//   }

//   try {
//     // Get user from your database using Auth0 email
//     const user = await prisma.user.findUnique({
//       where: { email: session.user.email },
//       select: { role: true }
//     });

//     // Check if user exists in database
//     if (!user) {
//       redirect('/onboarding'); // Or handle unregistered users
//     }

//     // Check manager role from database
//     if (user.role !== 'Manager') {
//       redirect('/unauthorized');
//     }

//     return (
//       <div className="container py-8">
//         <ProjectForm />
//       </div>
//     );

//   } catch (error) {
//     console.error('Error checking user role:', error);
//     redirect('/error');
//   }
// }



import { getSession } from '@auth0/nextjs-auth0';
import { redirect } from 'next/navigation';
import prisma from '@/lib/prisma';
import ProjectForm from "@/components/projects/ProjectForm";

export default async function NewProjectPage() {
  const session = await getSession();
  
  if (!session?.user) {
    redirect('/api/auth/login');
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        role: true,
        name: true,
        organizations: {
          select: {
            organization: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      }
    });

    if (!user) {
      redirect('/onboarding');
    }

    if (user.role !== 'Manager') {
      redirect('/unauthorized');
    }

    return (
      <div className="container py-8">
        <ProjectForm userData={user} />
      </div>
    );

  } catch (error) {
    console.error('Error checking user role:', error);
    redirect('/error');
  }
}
