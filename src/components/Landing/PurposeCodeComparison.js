"use client";

import React from "react";
import { CodeComparison } from "@/components/magicui/code-comparison";

export default function PurposeCodeComparison() {
  const beforeCode = `# Before Let's Connect:
class Collaboration:
    def work(self):
        print("Projects run in silos; teamwork is a myth.")`;

  const afterCode = `# After Let's Connect - Empowering Collaboration:
from typing import List, Dict, Tuple

class LetConnect:
    pass

    @property
    def teams(self) -> Tuple[List[str], int]:
        # List of project managers and contributors collaborating together
        members = ['Project Manager: Alice', 'Contributor: Bob']
        projectCount = 3
        return members, projectCount

    @property
    def collaboration(self) -> Tuple[Dict[str, List[str]], List[str], Dict[str, str]]:
        # Connect project managers with skilled contributors:
        skills = {
            'managers': ['leadership', 'project management'],
            'contributors': ['coding', 'design', 'testing']
        }
        benefits = ['enhanced resumes', 'project success']
        roles = {
            'PM': 'Ensures project delivery',
            'Contributor': 'Builds an impressive portfolio'
        }
        return skills, benefits, roles`;

  return (
    <div className="flex justify-center items-center my-12 px-4 sm:px-8">
      {/* Container that constrains the width and adds horizontal scrolling if needed */}
      <div className="w-full max-w-4xl overflow-x-auto">
        <CodeComparison
          beforeCode={beforeCode}
          afterCode={afterCode}
          language="python"
          filename="letconnect.py"
          lightTheme="github-light"
          darkTheme="github-dark"
        />
      </div>
    </div>
  );
}
