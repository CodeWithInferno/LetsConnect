import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("projectId");

  if (!projectId) {
    return NextResponse.json({ error: "Missing projectId" }, { status: 400 });
  }

  const session = await getSession(request);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Retrieve the user's GitHub token
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { githubAccessToken: true },
  });
  if (!user || !user.githubAccessToken) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  // Retrieve the project details (including the GitHub repo)
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    select: { githubRepo: true },
  });
  if (!project || !project.githubRepo) {
    return NextResponse.json({ error: "No GitHub repository linked" }, { status: 400 });
  }

  const headers = {
    Authorization: `Bearer ${user.githubAccessToken}`,
    Accept: "application/vnd.github.v3+json",
  };

  // Fetch the branches from GitHub
  const branchesRes = await fetch(`https://api.github.com/repos/${project.githubRepo}/branches`, { headers });
  if (!branchesRes.ok) {
    return NextResponse.json({ error: "Failed to fetch branches" }, { status: branchesRes.status });
  }

  const branches = await branchesRes.json();
  // Map to only return the needed branch details
  const branchList = branches.map(branch => ({
    name: branch.name,
    commitSha: branch.commit.sha,
    protected: branch.protected,
  }));

  return NextResponse.json({ branches: branchList });
}
