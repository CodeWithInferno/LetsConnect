// /pages/api/project/explore.fetch/route.js

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    // Optional query parameters for filtering
    const projectType = searchParams.get('projectType'); // e.g., open-source, freelance
    const organizationId = searchParams.get('organizationId'); // Filter by organization
    const skillsRequired = searchParams.get('skillsRequired'); // Comma-separated list of skills

    // Build filters dynamically based on provided parameters
    const filters = {};
    if (projectType) filters.projectType = projectType;
    if (organizationId) filters.organizationId = organizationId;

    // Handle skills filtering
    if (skillsRequired) {
      const skillsArray = skillsRequired.split(',').map((skill) => skill.trim());
      filters.skillsRequired = { hasSome: skillsArray };
    }

    // Fetch projects with filters and relations
    const projects = await prisma.project.findMany({
      where: filters,
      include: {
        owner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        organization: {
          select: {
            id: true,
            name: true,
            logo: true,
          },
        },
        members: true, // Includes project members if required
      },
    });

    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
