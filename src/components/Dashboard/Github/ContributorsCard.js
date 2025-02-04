import React from 'react';
import { Users } from 'lucide-react';

const ContributorsCard = ({ contributors }) => {
  return (
    <div className="bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 p-6 rounded-lg shadow-lg transition-colors duration-300 w-full">
      <div className="flex items-center mb-6">
        <Users className="mr-2 text-blue-400" />
        <h2 className="text-xl font-bold">Top Contributors</h2>
      </div>
      <div className="space-y-4">
        {contributors?.slice(0, 6).map((contributor) => (
          <div 
            key={contributor.id} 
            className="flex items-center space-x-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
          >
            <img
              src={contributor.avatar_url}
              alt={contributor.login}
              className="w-10 h-10 rounded-full border-2 border-blue-500"
            />
            <div className="flex-grow">
              <p className="text-base font-medium">
                {contributor.login}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {contributor.contributions} Contributions
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContributorsCard;
