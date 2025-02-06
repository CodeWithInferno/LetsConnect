'use client';
import React, { useState, useEffect } from 'react';
import ProjectDetailsCard from './ProjectDetailsCard';
import PullRequestsCard from './PullRequestsCard';
import CommitActivityCard from './CommitActivityCard';
import ContributorsCard from './ContributorsCard';
import BranchCard from '@/components/Dashboard/Github/BranchCard';
import IssuesCard from './IssuesCard';

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
  const [branches, setBranches] = useState([]);
  const [currentBranch, setCurrentBranch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  // Refresh GitHub token if needed
  useEffect(() => {
    async function checkAndRefreshToken() {
      try {
        const storedExpiry = localStorage.getItem("github_token_expiry");
        const currentTime = Math.floor(Date.now() / 1000);
        if (storedExpiry && currentTime < storedExpiry) {
          console.log("GitHub token is still valid. Skipping refresh.");
          return;
        }
        console.log("GitHub token expired. Refreshing...");
        const res = await fetch(`${BASE_URL}/api/github/refresh`, { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to refresh token");
        console.log("GitHub token refreshed successfully.");
        localStorage.setItem("github_token_expiry", currentTime + 28800); // 8 hours
      } catch (err) {
        console.error("GitHub Token Refresh Error:", err.message);
      }
    }
    checkAndRefreshToken();
  }, [BASE_URL]);

  // Fetch project details
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
  }, [projectId, BASE_URL]);

  // Fetch GitHub data (pull requests, commits, contributors) when project or branch changes
  useEffect(() => {
    async function fetchGitHubData() {
      if (!project || !project.githubRepo) return;
      try {
        setLoading(true);
        const branchParam = currentBranch ? `&branch=${encodeURIComponent(currentBranch)}` : "";
        let res = await fetch(`${BASE_URL}/api/github/data?projectId=${encodeURIComponent(projectId)}${branchParam}`);
        let data = await res.json();
        if (data.error && data.error.includes("GitHub token expired")) {
          console.log("Refreshing GitHub token...");
          await fetch(`${BASE_URL}/api/github/refresh`, { method: "POST" });
          res = await fetch(`${BASE_URL}/api/github/data?projectId=${encodeURIComponent(projectId)}${branchParam}`);
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
  }, [project, currentBranch, projectId, BASE_URL]);

  // Fetch branches after project details are available
  useEffect(() => {
    async function fetchBranches() {
      try {
        const res = await fetch(`${BASE_URL}/api/github/branches?projectId=${encodeURIComponent(projectId)}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setBranches(data.branches);
        if (data.branches.length > 0 && !currentBranch) {
          setCurrentBranch(data.branches[0].name);
        }
      } catch (err) {
        console.error("Error fetching branches:", err);
      }
    }
    if (project) {
      fetchBranches();
    }
  }, [project, projectId, BASE_URL]);

  if (loading) return <div className="p-8 text-center">Loading GitHub data...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>;
  if (!project) return <div className="p-8 text-center">No project details found.</div>;

  return (
    <div className="container mx-auto p-8 space-y-8">
      {/* Top row: Project details & Branch selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <ProjectDetailsCard project={project} />
        <BranchCard 
          branches={branches}
          currentBranch={currentBranch}
          setCurrentBranch={setCurrentBranch}
        />
      </div>

      {/* Bottom row: GitHub data cards */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <PullRequestsCard pullRequests={pullRequests} />
        <CommitActivityCard commits={commits} />
        <ContributorsCard contributors={contributors} />
        <IssuesCard projectId={projectId} BASE_URL={BASE_URL} />
      </div>
    </div>
  );
}
