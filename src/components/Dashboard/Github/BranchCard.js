'use client';
import React from 'react';
import SourceControlIndicator from './SourceControlIndicator';
import BranchDropdown from '@/components/BranchDropdown';

const BranchCard = ({ branches, currentBranch, setCurrentBranch, isConnected = true }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md transition hover:shadow-lg">
      <div className="flex flex-col space-y-4">
        <SourceControlIndicator isConnected={isConnected} branchName={currentBranch || 'main'} />
        {branches && branches.length > 0 && (
          <BranchDropdown 
            branches={branches} 
            currentBranch={currentBranch} 
            setCurrentBranch={setCurrentBranch} 
          />
        )}
      </div>
    </div>
  );
};

export default BranchCard;
