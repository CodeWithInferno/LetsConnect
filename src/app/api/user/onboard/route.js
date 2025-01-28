import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getSession } from '@auth0/nextjs-auth0';

const prisma = new PrismaClient();
const PREDEFINED_SKILLS = [
  'React',
  'Python',
  'UI/UX',
  'Blockchain',
  'TypeScript',
  'Machine Learning',
];

export async function POST(req) {
  try {
    const session = await getSession(req);
    
    // Check authentication
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Parse request body
    const { 
      username,
      skills = [],
      name, 
      number, 
      phone_extension,
      profilePicture, 
      interests, 
      role, 
      timezone, 
      qualifications 
    } = await req.json();

    const email = session.user.email;

    const existingUsername = await prisma.user.findUnique({
      where: { username },
    });
    
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }


    // Check existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 });
    }

    // Create new user
    const newUser = await prisma.user.create({
      data: {
        email,
        name,
        username,
        number,
        phone_extension,
        profile_picture: profilePicture,
        interests,
        role,
        timezone,
        qualifications,
        joined_at: new Date(),
      },
    });

    // Process skills
    for (const skillName of skills) {
      // Validate skill name
      const trimmedSkill = skillName.trim();
      if (!trimmedSkill) continue;

      // Upsert skill
      const skill = await prisma.skill.upsert({
        where: { name: trimmedSkill },
        update: {},
        create: {
          name: trimmedSkill,
          isCustom: !PREDEFINED_SKILLS.includes(trimmedSkill),
        },
      });

      // Connect skill to user
      await prisma.userSkill.create({
        data: {
          userId: newUser.id,
          skillId: skill.id,
        },
      });
    }

    return NextResponse.json(
      { success: true, user: newUser },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}