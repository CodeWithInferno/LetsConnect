import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const existingOrg = await prisma.organization.findUnique({
      where: { slug },
    });

    return NextResponse.json({
      available: !existingOrg,
    });
  } catch (error) {
    console.error('Error checking slug:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
