import { NextResponse } from "next/server";
import { getSession } from "@auth0/nextjs-auth0";
import prisma from "@/lib/prisma";

export async function GET(request) {
  // Get the user session to know which user is making this request
  const session = await getSession(request);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Retrieve the stored refresh token from the database
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    select: { githubRefreshToken: true },
  });

  if (!user || !user.githubRefreshToken) {
    return NextResponse.json({ error: "GitHub not connected" }, { status: 400 });
  }

  // Request a new access token using the refresh token
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID; // Public variable is fine here for client identifier
  const clientSecret = process.env.GITHUB_CLIENT_SECRET; // Server-side only
  const refreshToken = user.githubRefreshToken;

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: "refresh_token", // indicate refresh token flow
      refresh_token: refreshToken,
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log("GitHub refresh token response:", tokenData);

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
  }

  const { access_token, refresh_token: newRefreshToken } = tokenData;

  // Update the user record with the new tokens
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      githubAccessToken: access_token,
      // Optionally update the refresh token if provided
      githubRefreshToken: newRefreshToken || refreshToken,
    },
  });

  return NextResponse.json({ success: true, access_token });
}
