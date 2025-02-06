// /api/github/issues/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  
  if (!projectId) {
    return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
  }
  
  const session = await getSession(request);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'User not authenticated' }, { status: 401 });
  }
  
  // Get the GitHub token from your DB
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { githubAccessToken: true },
  });
  if (!user || !user.githubAccessToken) {
    return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
  }
  
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubRepo: true },
  });
  if (!project || !project.githubRepo) {
    return NextResponse.json({ error: 'No GitHub repository linked' }, { status: 400 });
  }
  
  const headers = {
    Authorization: `Bearer ${user.githubAccessToken}`,
    Accept: 'application/vnd.github.v3+json',
  };
  
  const issuesRes = await fetch(`https://api.github.com/repos/${project.githubRepo}/issues?state=open`, { headers });
  
  if (!issuesRes.ok) {
    return NextResponse.json({ error: 'Failed to fetch issues' }, { status: issuesRes.status });
  }
  
  const issues = await issuesRes.json();
  // You can map issues here to return only the fields you need
  return NextResponse.json({ issues });
}
