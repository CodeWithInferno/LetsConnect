'use client';

import React, { useState, useEffect } from 'react';
import ProjectDetailsCard from './ProjectDetailsCard';
import PullRequestsCard from './PullRequestsCard';
import CommitActivityCard from './CommitActivityCard';
import ContributorsCard from './ContributorsCard';
import SourceControlIndicator from './SourceControlIndicator';

const MY_PROJECT_QUERY = `
  query MyProject($projectId: String!) {
    myProject(projectId: $projectId) {
      githubRepo
    }
  }
`;

export default function GithubDashboard({ projectId }) {
  const [project, setProject] = useState(null);
  const [pullRequests, setPullRequests] = useState([]);
  const [commits, setCommits] = useState([]);
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  useEffect(() => {
    async function checkAndRefreshToken() {
      try {
        // Get stored expiry timestamp
        const storedExpiry = localStorage.getItem("github_token_expiry");
        const currentTime = Math.floor(Date.now() / 1000); // Convert to seconds

        // If token is not expired, skip refresh
        if (storedExpiry && currentTime < storedExpiry) {
          console.log("GitHub token is still valid. Skipping refresh.");
          return;
        }

        console.log("GitHub token expired. Refreshing...");

        // Refresh the token
        const res = await fetch(`${BASE_URL}/api/github/refresh`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to refresh token");

        console.log("GitHub token refreshed successfully.");

        // Store the new expiry timestamp (current time + expires_in)
        localStorage.setItem("github_token_expiry", currentTime + 28800); // 8 hours
      } catch (err) {
        console.error("GitHub Token Refresh Error:", err.message);
      }
    }

    checkAndRefreshToken();
  }, []);

  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/graphql`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            query: MY_PROJECT_QUERY,
            variables: { projectId },
          }),
        });
        const json = await res.json();
        if (json.errors) throw new Error(json.errors[0].message);
        const proj = json.data.myProject;
        if (!proj) throw new Error("Project not found.");
        setProject(proj);
        return proj;
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProjectDetails();
  }, [projectId]);

  useEffect(() => {
    async function fetchGitHubData() {
      if (!project || !project.githubRepo) return;
      try {
        setLoading(true);
        let res = await fetch(`${BASE_URL}/api/github/data?projectId=${encodeURIComponent(projectId)}`, { method: 'GET' });
        let data = await res.json();

        if (data.error && data.error.includes("GitHub token expired")) {
          console.log("Refreshing GitHub token...");
          await fetch(`${BASE_URL}/api/github/refresh`, { method: "POST" });

          res = await fetch(`${BASE_URL}/api/github/data?projectId=${encodeURIComponent(projectId)}`, { method: 'GET' });
          data = await res.json();
        }

        if (data.error) throw new Error(data.error);
        setPullRequests(data.pullRequests);
        setCommits(data.commits);
        setContributors(data.contributors);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGitHubData();
  }, [project]);


  if (loading) return <div>Loading GitHub data...</div>;
  if (error) return <div className="text-red-500">Error: {error}</div>;
  if (!project) return <div>No project details found.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ProjectDetailsCard project={project} />
      <PullRequestsCard pullRequests={pullRequests} />
      <CommitActivityCard commits={commits} />
      <ContributorsCard contributors={contributors} />
      <SourceControlIndicator isConnected={true} branchName="main" />
    </div>
  );
}
