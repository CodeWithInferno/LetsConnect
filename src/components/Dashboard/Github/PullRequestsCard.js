import React from 'react';

const PullRequestsCard = ({ pullRequests }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-colors duration-300">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
        Open Pull Requests
      </h2>
      <div className="space-y-4">
        {pullRequests?.map((pr) => (
          <div key={pr.id} className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <a
              href={pr.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-200"
            >
              #{pr.number} {pr.title}
            </a>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              by {pr.user?.login || 'Unknown'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PullRequestsCard;
