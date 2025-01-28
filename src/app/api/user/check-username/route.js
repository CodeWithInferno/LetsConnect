import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json({ error: 'Username is required' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    return NextResponse.json({
      available: !existingUser,
    });
  } catch (error) {
    console.error('Error checking username:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
