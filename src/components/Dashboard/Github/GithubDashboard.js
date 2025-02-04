// components/Dashboard/Github/GithubDashboard.jsx
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

  // Fetch project details from GraphQL
  useEffect(() => {
    async function fetchProjectDetails() {
      try {
        setLoading(true);
        const res = await fetch('/api/graphql', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            query: MY_PROJECT_QUERY,
            variables: { projectId },
          }),
        });
        const json = await res.json();
        if (json.errors) {
          throw new Error(json.errors[0].message);
        }
        const proj = json.data.myProject;
        if (!proj) {
          throw new Error("Project not found.");
        }
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

  // Once project details are loaded, fetch GitHub data using its githubRepo field
  useEffect(() => {
    async function fetchGitHubData() {
      if (!project || !project.githubRepo) return;
      try {
        setLoading(true);
// components/Dashboard/Github/GithubDashboard.jsx
// Change the API call from 'repo' to 'projectId'
        const res = await fetch(
          `/api/github/data?projectId=${encodeURIComponent(projectId)}`, // Changed parameter name
          { method: 'GET' }
        );
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
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
