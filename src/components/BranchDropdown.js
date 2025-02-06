'use client';
import React from 'react';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'; // adjust import as needed

const BranchDropdown = ({ branches, currentBranch, setCurrentBranch }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="btn">
        {currentBranch || "Select Branch"}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {branches.map((branch) => (
          <DropdownMenuItem
            key={branch.name}
            onClick={() => setCurrentBranch(branch.name)}
          >
            {branch.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BranchDropdown;
