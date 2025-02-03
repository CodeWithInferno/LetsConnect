// components/ConnectGitHubButton.jsx
'use client';

import React from "react";
import { Button } from "@/components/ui/button";

export default function ConnectGitHubButton() {
  const connectGitHub = () => {
    // Use NEXT_PUBLIC_GITHUB_CLIENT_ID since it is exposed to the client
    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const scope = "repo,user"; // Adjust scopes as needed
    const redirectUri = process.env.NEXT_PUBLIC_GITHUB_CALLBACK_URL; // e.g., http://localhost:3000/api/github/callback
    const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${scope}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    // Redirect the user to GitHub's OAuth page
    window.location.href = githubAuthUrl;
  };

  return (
    <Button onClick={connectGitHub}>
      Connect GitHub
    </Button>
  );
}
