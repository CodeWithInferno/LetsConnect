import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma'; // Use the singleton instance
import { getSession } from '@auth0/nextjs-auth0';

const PREDEFINED_INDUSTRIES = [
  'IT Services',
  'Software',
  'Finance',
  'Education',
];

export async function POST(req) {
  try {
    const session = await getSession(req);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user email from session
    const userEmail = session.user.email;

    // Ensure the user exists
    const user = await prisma.user.findUnique({
      where: { email: userEmail },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse request body
    const {
      orgName,
      slug,
      phone_extension,
      number,
      logoUrl,
      industry,
      location,
      timezone,
    } = await req.json();

    // Check if slug already exists
    const existingSlug = await prisma.organization.findUnique({
      where: { slug },
    });
    if (existingSlug) {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }

    // Create new organization
    const newOrg = await prisma.organization.create({
      data: {
        name: orgName,
        slug,
        phone_extension,
        number,
        logo: logoUrl,
        industry,
        location,
        timezone,
      },
    });

    // Link organization to user
    await prisma.organizationMember.create({
      data: {
        userId: user.id,
        organizationId: newOrg.id,
        role: 'Owner',
      },
    });

    return NextResponse.json({ success: true, organization: newOrg }, { status: 201 });

  } catch (error) {
    console.error('Error creating organization:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
