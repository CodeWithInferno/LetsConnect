import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import prisma from '@/lib/prisma';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('projectId');

  try {
    // 1. Validate projectId
    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId parameter' },
        { status: 400 }
      );
    }

    // 2. Authenticate user
    const session = await getSession(request);
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // 3. Get project with owner's GitHub tokens
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: {
          select: {
            githubAccessToken: true,
            githubRefreshToken: true,
          }
        }
      }
    });

    if (!project) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      );
    }

    // 4. Check for GitHub repo link
    if (!project.githubRepo) {
      return NextResponse.json(
        { error: 'No GitHub repository linked' },
        { status: 400 }
      );
    }

    // 5. Validate repository format
    const repoRegex = /^[a-zA-Z0-9_.-]+\/[a-zA-Z0-9_.-]+$/;
    if (!repoRegex.test(project.githubRepo)) {
      return NextResponse.json(
        { error: 'Invalid repository format' },
        { status: 400 }
      );
    }

    // 6. Check for valid GitHub tokens
    if (!project.owner?.githubAccessToken) {
      return NextResponse.json(
        { error: 'Project owner has not connected GitHub' },
        { status: 401 }
      );
    }

    // 7. Prepare GitHub API headers
    const headers = {
      Authorization: `Bearer ${project.owner.githubAccessToken}`,
      Accept: 'application/vnd.github.v3+json',
    };

    // 8. Fetch GitHub data with better error handling
    const [pullsRes, commitsRes, contributorsRes] = await Promise.all([
      fetch(`https://api.github.com/repos/${project.githubRepo}/pulls?state=open`, { headers }),
      fetch(`https://api.github.com/repos/${project.githubRepo}/commits`, { headers }),
      fetch(`https://api.github.com/repos/${project.githubRepo}/contributors`, { headers }),
    ]);

    // Handle GitHub API errors
    if (!pullsRes.ok) {
      const error = await pullsRes.json();
      console.error('GitHub PRs Error:', error);
      throw new Error(`GitHub PRs: ${error.message}`);
    }

    if (!commitsRes.ok) {
      const error = await commitsRes.json();
      console.error('GitHub Commits Error:', error);
      throw new Error(`GitHub Commits: ${error.message}`);
    }

    if (!contributorsRes.ok) {
      const error = await contributorsRes.json();
      console.error('GitHub Contributors Error:', error);
      throw new Error(`GitHub Contributors: ${error.message}`);
    }

    // 9. Parse responses
    const [pullRequests, commits, contributors] = await Promise.all([
      pullsRes.json(),
      commitsRes.json(),
      contributorsRes.json(),
    ]);

    return NextResponse.json({
      pullRequests,
      commits,
      contributors,
    });

  } catch (error) {
    console.error('GitHub Data Fetch Error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to fetch GitHub data',
        details: error.details 
      },
      { status: 500 }
    );
  }
}