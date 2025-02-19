'use client';
import React from 'react';
import { format } from 'date-fns';
import { GitCommit, Clock } from 'lucide-react';

const CommitActivityCard = ({ commits }) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white p-6 rounded-xl shadow-md transition hover:shadow-lg">
      <div className="flex items-center mb-4">
        <GitCommit className="mr-2 text-blue-500 dark:text-blue-400" />
        <h2 className="text-lg font-bold">Recent Commits</h2>
      </div>
      <div className="space-y-3">
        {commits && commits.length > 0 ? (
          commits.slice(0, 5).map((commit) => (
            <div key={commit.sha} className="bg-gray-200 dark:bg-gray-700 p-3 rounded-md border-l-4 border-blue-500">
              <div className="flex justify-between items-center mb-1">
                <p className="font-mono text-xs text-blue-600 dark:text-blue-300">{commit.sha.substring(0, 7)}</p>
                <p className="text-xs text-gray-600 dark:text-gray-300 flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {format(new Date(commit.commit.author.date), 'MMM dd, HH:mm')}
                </p>
              </div>
              <p className="text-sm text-gray-800 dark:text-gray-300 line-clamp-2">{commit.commit.message}</p>
            </div>
          ))
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400">No recent commits found.</p>
        )}
      </div>
    </div>
  );
};

export default CommitActivityCard;
