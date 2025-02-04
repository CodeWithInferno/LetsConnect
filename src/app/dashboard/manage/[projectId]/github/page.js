// app/dashboard/manage/[projectId]/github/page.jsx
import React from 'react';
import GithubDashboard from '@/components/Dashboard/Github/GithubDashboard';
import Layout from '@/components/Dashboard/Layout';

export default function ProjectGithubPage({ params }) {
  const projectId = params.projectId; // extracted from URL parameters

  return (
    <Layout>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-6">GitHub Dashboard</h1>
        <GithubDashboard projectId={projectId} />
      </div>
    </Layout>
  );
}
