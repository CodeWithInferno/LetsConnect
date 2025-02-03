// // app/api/github/callback/route.js
// import { NextResponse } from 'next/server';

// export async function GET(request) {
//   const { searchParams } = new URL(request.url);
//   const code = searchParams.get('code');

//   if (!code) {
//     return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
//   }

//   const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
//   const clientSecret = process.env.GITHUB_CLIENT_SECRET;

//   const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
//     method: "POST",
//     headers: {
//       "Accept": "application/json",
//       "Content-Type": "application/json"
//     },
//     body: JSON.stringify({
//       client_id: clientId,
//       client_secret: clientSecret,
//       code,
//     }),
//   });

//   const tokenData = await tokenResponse.json();
//   console.log("GitHub token response:", tokenData); // Log for debugging

//   if (tokenData.error) {
//     // Return the error details so you can see what GitHub is saying
//     return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
//   }

//   const { access_token } = tokenData;
  
//   // TODO: Associate the access token with the current user (store it securely)

//   // Redirect the user back to your settings/dashboard page
//   return NextResponse.redirect(new URL("/", request.url));
// }

















// app/api/github/callback/route.js
import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0'; // Adjust import if necessary
import prisma from '../../../../lib/prisma'; // Adjust path as needed

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: "Missing code parameter" }, { status: 400 });
  }

  // Exchange code for access token
  const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;
  

  const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      client_id: clientId,
      client_secret: clientSecret,
      code,
    }),
  });

  const tokenData = await tokenResponse.json();
  console.log("GitHub token response:", tokenData); // For debugging

  if (tokenData.error) {
    return NextResponse.json({ error: tokenData.error_description || tokenData.error }, { status: 400 });
  }

  const { access_token, refresh_token } = tokenData;

  // Fetch GitHub profile info using the access token
  const githubProfileResponse = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `token ${access_token}`,
      Accept: "application/vnd.github.v3+json",
    },
  });
  const githubProfile = await githubProfileResponse.json();
  console.log("GitHub profile:", githubProfile);

  // Get the current user from your Auth0 session.
  // This example uses getSession from '@auth0/nextjs-auth0'.
  // Make sure the request object you pass is compatible with your version.
  const session = await getSession(request);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
  }

  // Update the current user's record with GitHub data.
  // Make sure your Prisma schema includes these fields (githubAccessToken, githubUsername, githubAvatar).
  await prisma.user.update({
    where: { email: session.user.email },
    data: {
      githubAccessToken: access_token,
      githubRefreshToken: refresh_token,
      githubUsername: githubProfile.login,
      githubAvatar: githubProfile.avatar_url,
    },
  });

  // Redirect back to the settings or dashboard page.
  return NextResponse.redirect(new URL("/", request.url));
}
