import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');
  const branch = searchParams.get('branch'); // Optional branch parameter

  try {
    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    const session = await getSession(request);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if the user has a valid GitHub token
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { githubAccessToken: true },
    });
    if (!user || !user.githubAccessToken) {
      return NextResponse.json({ error: 'GitHub not connected' }, { status: 400 });
    }

    // Retrieve the project details (including the GitHub repo)
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

    // Use the branch parameter (if provided) in the API calls
    const pullsUrl = branch
      ? `https://api.github.com/repos/${project.githubRepo}/pulls?state=open&base=${branch}`
      : `https://api.github.com/repos/${project.githubRepo}/pulls?state=open`;
    const commitsUrl = branch
      ? `https://api.github.com/repos/${project.githubRepo}/commits?sha=${branch}`
      : `https://api.github.com/repos/${project.githubRepo}/commits`;
    const contributorsUrl = `https://api.github.com/repos/${project.githubRepo}/contributors`;

    const [pullsRes, commitsRes, contributorsRes] = await Promise.all([
      fetch(pullsUrl, { headers }),
      fetch(commitsUrl, { headers }),
      fetch(contributorsUrl, { headers }),
    ]);

    if (
      pullsRes.status === 401 ||
      commitsRes.status === 401 ||
      contributorsRes.status === 401
    ) {
      console.warn("GitHub token expired, refreshing...");
      await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/github/refresh`, { method: "POST" });
      return NextResponse.json({ error: "GitHub token expired. Please refresh and try again." }, { status: 401 });
    }

    if (!pullsRes.ok || !commitsRes.ok || !contributorsRes.ok) {
      return NextResponse.json({ error: "Failed to fetch GitHub data" }, { status: 500 });
    }

    const [pullRequests, commits, contributors] = await Promise.all([
      pullsRes.json(),
      commitsRes.json(),
      contributorsRes.json(),
    ]);

    return NextResponse.json({ pullRequests, commits, contributors });
  } catch (error) {
    console.error('GitHub Data Fetch Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch GitHub data' }, { status: 500 });
  }
}
