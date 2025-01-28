import React from "react";
import { Calendar, Code2, Briefcase, Award } from "lucide-react";

const ProjectCard = ({ project }) => {
  const truncatedDescription =
    project.description && project.description.length > 100
      ? `${project.description.slice(0, 100)}...`
      : project.description || "Project description will appear here.";

  // Convert the ISO date to a human-readable format
  const formattedDeadline = project.deadline
    ? new Date(project.deadline).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "No deadline";

  return (
    <div className="group relative w-full rounded-xl dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {project.certificateEligible && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 shadow-lg">
            <Award className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold text-white">Certificate</span>
          </div>
        </div>
      )}

      <div className="relative w-full h-40 overflow-hidden rounded-t-xl">
        {project.bannerImage ? (
          <>
            <img
              src={project.bannerImage}
              alt="Project Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/0 to-black/20" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
            <span className="text-gray-500 dark:text-gray-400">
              No Banner Image
            </span>
          </div>
        )}
      </div>

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.title || "Project Title"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {truncatedDescription}
        </p>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.skillsRequired.map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              {skill}
            </span>
          ))}
          {project.languages.map((language, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            >
              {language}
            </span>
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Calendar className="w-4 h-4" />
            <span>{formattedDeadline}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Briefcase className="w-4 h-4" />
            <span>{project.budget ? `$${project.budget}` : "No budget"}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
            <Code2 className="w-4 h-4" />
            <span>{project.projectType || "No type"}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
