// components/profile/ProjectCard.js
"use client";

import { Star, Forklift, Dot } from "lucide-react";
import { getLanguageColor } from "@/lib/colorutil";

export default function ProjectCard({ project }) {
  return (
    <div className="p-4 border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-semibold text-primary truncate">
            {project.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            Updated {project.updated}
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {project.description}
        </p>

        <div className="mt-auto flex items-center gap-4 text-xs">
          {project.language && (
            <div className="flex items-center gap-1">
              <Dot className="h-4 w-4" style={{ color: getLanguageColor(project.language) }} />
              <span>{project.language}</span>
            </div>
          )}
          
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4" />
            <span>{project.stars.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Forklift className="h-4 w-4" />
            <span>{project.forks.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}