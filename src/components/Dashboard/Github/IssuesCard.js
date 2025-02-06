'use client';
import React, { useState, useEffect } from 'react';

const IssuesCard = ({ projectId, BASE_URL }) => {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchIssues() {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/api/github/issues?projectId=${encodeURIComponent(projectId)}`);
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setIssues(data.issues);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchIssues();
  }, [projectId, BASE_URL]);

  if (loading) return <div className="p-6">Loading Issues...</div>;
  if (error) return <div className="p-6 text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Open Issues</h2>
      {issues && issues.length > 0 ? (
        <ul className="space-y-3">
          {issues.map((issue) => (
            <li key={issue.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <a
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                #{issue.number} {issue.title}
              </a>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                Created by {issue.user?.login || 'Unknown'}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-500 dark:text-gray-400">No open issues found.</p>
      )}
    </div>
  );
};

export default IssuesCard;
