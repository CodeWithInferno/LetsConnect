'use client';
import React from 'react';
import { Users } from 'lucide-react';

const ContributorsCard = ({ contributors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition hover:shadow-lg">
      <div className="flex items-center mb-4">
        <Users className="mr-2 text-blue-400" />
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Top Contributors</h2>
      </div>
      <div className="space-y-3">
        {contributors && contributors.length > 0 ? (
          contributors.slice(0, 6).map((contributor) => (
            <div key={contributor.id} className="flex items-center space-x-4 bg-gray-50 dark:bg-gray-700 p-3 rounded-md">
              <img
                src={contributor.avatar_url}
                alt={contributor.login}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{contributor.login}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300">
                  {contributor.contributions} Contributions
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">No contributors found.</p>
        )}
      </div>
    </div>
  );
};

export default ContributorsCard;
