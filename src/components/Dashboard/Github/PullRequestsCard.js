'use client';
import React from 'react';

const PullRequestsCard = ({ pullRequests }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition hover:shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Open Pull Requests</h2>
      <div className="space-y-3">
        {pullRequests && pullRequests.length > 0 ? (
          pullRequests.map((pr) => (
            <div key={pr.id} className="border-b border-gray-200 dark:border-gray-700 pb-3">
              <a
                href={pr.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
              >
                #{pr.number} {pr.title}
              </a>
              <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                by {pr.user?.login || 'Unknown'}
              </p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No open pull requests found.</p>
        )}
      </div>
    </div>
  );
};

export default PullRequestsCard;
