'use client';
import React from 'react';
import { Github, Link, Link2Off } from 'lucide-react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProjectDetailsCard({ project }) {
  const fullRepoUrl = project.githubRepo
    ? `https://github.com/${project.githubRepo}`
    : null;

  return (
    <Card className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-md transition hover:shadow-xl">
      <CardHeader className="p-4 flex items-center justify-between bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-800 dark:to-indigo-800 rounded-t-xl">
        <div className="flex items-center space-x-3">
          <Github className="w-6 h-6 text-gray-700 dark:text-gray-300" />
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Project Details
          </h2>
        </div>
        {project.status && (
          <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="uppercase tracking-wide">
            {project.status}
          </Badge>
        )}
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">{project.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 italic">{project.description}</p>
        </div>

        {fullRepoUrl ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
              <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <a
                href={fullRepoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-700 dark:text-blue-300 hover:underline truncate"
              >
                {fullRepoUrl}
              </a>
            </div>
            {project.repoTitle && (
              <h4 className="text-md font-semibold text-gray-800 dark:text-gray-200">{project.repoTitle}</h4>
            )}
            {project.repoDescription && (
              <p className="text-sm text-gray-600 dark:text-gray-400">{project.repoDescription}</p>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-700 p-3 rounded-md opacity-75">
            <Link2Off className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <span className="text-sm text-gray-500 dark:text-gray-400">No repository link available</span>
          </div>
        )}

        {project.website && (
          <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <Link className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <a
              href={project.website}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-700 dark:text-blue-300 hover:underline truncate"
            >
              {project.website}
            </a>
          </div>
        )}

        {project.technologies && project.technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="outline" className="text-xs">
                {tech}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
