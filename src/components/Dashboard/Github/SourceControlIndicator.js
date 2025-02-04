// components/SourceControlIndicator.jsx
import React from 'react';
import { Github } from 'lucide-react';

const SourceControlIndicator = ({ isConnected, branchName }) => {
  return (
    <div className="flex items-center space-x-2">
      <div className="relative">
        <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {isConnected && (
          <span
            className="absolute -bottom-1 -right-1 block w-3 h-3 rounded-full bg-green-500 border-2 border-white dark:border-gray-900"
            title="Connected"
          ></span>
        )}
      </div>
      {isConnected ? (
        <span className="text-blue-700 dark:text-blue-300 font-medium">
          Connected on branch <span className="font-bold">{branchName || 'main'}</span>
        </span>
      ) : (
        <span className="text-gray-500 dark:text-gray-400 font-medium">
          Not connected
        </span>
      )}
    </div>
  );
};

export default SourceControlIndicator;
