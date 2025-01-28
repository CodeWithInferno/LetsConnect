// app/api/skills/route.js
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;
    
    const skills = await prisma.skill.findMany({
      select: { name: true },
      orderBy: { name: 'asc' }
    });

    return NextResponse.json(
      skills.map(s => s.name), 
      { status: 200 }
    );

  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch skills',
        details: error.message,
        prismaVersion: prisma?.version?.client
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}