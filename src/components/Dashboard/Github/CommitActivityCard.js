import React from 'react';
import { format } from 'date-fns';
import { GitCommit, Clock } from 'lucide-react';

const CommitActivityCard = ({ commits }) => {
  return (
    <div className="bg-gray-900 text-white p-4 md:p-6 rounded-lg shadow-xl dark:bg-gray-800 max-w-2xl mx-auto">
      <div className="flex items-center mb-4">
        <GitCommit className="mr-2 text-blue-400" />
        <h2 className="text-lg md:text-xl font-bold">Recent Commits</h2>
      </div>
      <div className="space-y-3">
        {commits?.slice(0, 5).map((commit) => (
          <div key={commit.sha} className="bg-gray-800 p-3 rounded-md border-l-4 border-blue-500">
            <div className="flex justify-between items-center mb-1">
              <p className="font-mono text-xs text-blue-300">{commit.sha.substring(0, 7)}</p>
              <p className="text-xs text-gray-400 flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {format(new Date(commit.commit.author.date), 'MMM dd, HH:mm')}
              </p>
            </div>
            <p className="text-sm text-gray-200 line-clamp-2">{commit.commit.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommitActivityCard;