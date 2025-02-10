
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
        githubAccessToken: true,
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
