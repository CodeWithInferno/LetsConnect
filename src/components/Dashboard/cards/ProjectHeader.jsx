"use client";

import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export default function ProjectHeader({ project, onSettingsClick }) {
  return (
    <div className="mb-6 flex justify-between items-start">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {project.title}
        </h1>
        <p className="mt-1 text-gray-500 dark:text-gray-400 max-w-2xl">
          {project.description}
        </p>
      </div>
      <Button
        onClick={onSettingsClick}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Settings className="h-4 w-4" />
        <span>Settings</span>
      </Button>
    </div>
  );
}