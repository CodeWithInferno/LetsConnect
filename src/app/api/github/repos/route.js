// app/api/github/repos/route.js
import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";

export async function GET(request) {
  // Get the session so we know which user is making this request.
  const session = await getSession(request);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Retrieve the user from your database (ensure you have stored their GitHub token).
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { githubAccessToken: true },
  });

  if (!user || !user.githubAccessToken) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  // Use the GitHub access token to fetch the repositories
  const repoResponse = await fetch("https://api.github.com/user/repos", {
    headers: {
      Authorization: `token ${user.githubAccessToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!repoResponse.ok) {
    return NextResponse.json({ error: "Failed to fetch repositories" }, { status: repoResponse.status });
  }

  const repos = await repoResponse.json();
  // Optionally filter or map the repos to only return needed fields.
  const repoList = repos.map((repo) => ({
    id: repo.id,
    name: repo.name,
    full_name: repo.full_name,
    html_url: repo.html_url,
  }));

  return NextResponse.json({ repos: repoList });
}
