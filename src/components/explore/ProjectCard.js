"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Calendar, Code2, Briefcase, Award } from "lucide-react";
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent } from "@/components/ui/card"; // optional if needed
import { Button } from "@/components/ui/button";

// An example “applyToProject” GraphQL mutation
async function applyToProject(projectId) {
  const mutation = `
    mutation ApplyToProject($projectId: String!) {
      applyToProject(projectId: $projectId) {
        id
        status
        role
      }
    }
  `;
  const res = await fetch("/api/graphql", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // if needed for auth
    body: JSON.stringify({
      query: mutation,
      variables: { projectId },
    }),
  });
  const { data, errors } = await res.json();
  if (errors?.length) throw new Error(errors[0].message);
  return data.applyToProject;
}

const ProjectCard = ({ project, currentUser }) => {
  // track local UI state if user is “joining”
  const [joining, setJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false); // Or "pending" or similar

  // Figure out if user is already a member or is pending
  const userMembership = project.members?.find((m) => m.user?.id === currentUser?.id);
  const userIsMember = userMembership && userMembership.status === "ACTIVE";
  const userIsPending = userMembership && userMembership.status === "PENDING";

  // Handler for the “Join” button
  const handleJoinClick = async () => {
    setJoining(true);
    try {
      const membership = await applyToProject(project.id);
      if (membership.status === "PENDING") {
        // Optionally update local UI
        setHasJoined(true);
      }
    } catch (err) {
      console.error("Error applying to project:", err);
      // Optionally show an error toast or alert
    } finally {
      setJoining(false);
    }
  };

  // Format or truncate the description
  const truncatedDescription =
    project.description && project.description.length > 100
      ? `${project.description.slice(0, 100)}...`
      : project.description || "Project description here.";

  // Format the deadline if needed
  let formattedDeadline = "No deadline";
  if (project.deadline) {
    const d = new Date(project.deadline);
    if (!isNaN(d.getTime())) {
      formattedDeadline = d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  }

  return (
    <div className="group relative w-full rounded-xl dark:bg-gray-800 bg-white border dark:border-gray-700 border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Certificate Eligible Badge */}
      {project.certificateEligible && (
        <div className="absolute -top-2 -right-2 z-20">
          <div className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 shadow-lg">
            <Award className="w-4 h-4 text-white" />
            <span className="text-xs font-semibold text-white">Certificate</span>
          </div>
        </div>
      )}

      {/* Banner Image */}
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
            <span className="text-gray-500 dark:text-gray-400">No Banner Image</span>
          </div>
        )}
      </div>

      {/* The "Join" Button in top-right, below banner */}
      <div className="absolute top-36 right-4 transform -translate-y-1/2 flex">
        {!currentUser ? (
          <></>
        ) : userIsMember ? (
          <div className="px-3 py-1 rounded-md bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 text-sm">
            Joined
          </div>
        ) : userIsPending || hasJoined ? (
          <div className="px-3 py-1 rounded-md bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 text-sm">
            Pending
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            disabled={joining}
            onClick={handleJoinClick}
          >
            {joining ? "Joining..." : "Join"}
          </Button>
        )}
      </div>

      {/* Card Content */}
      <div className="p-6 pt-2"> {/* Adjust top padding to accommodate button space */}
        <h2 className="mt-4 text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
          {project.title || "Project Title"}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {truncatedDescription}
        </p>

        {/* Skills & Languages */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(project.skillsRequired || []).map((skill, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
            >
              {skill}
            </span>
          ))}
          {(project.languages || []).map((language, index) => (
            <span
              key={index}
              className="px-2.5 py-1 text-xs font-medium rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400"
            >
              {language}
            </span>
          ))}
        </div>

        {/* Basic Info */}
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

        {/* Collapsible for members */}
        {project.members && project.members.length > 0 && (
          <Collapsible className="mt-4">
            <CollapsibleTrigger className="w-full flex items-center justify-between text-sm font-semibold text-gray-700 dark:text-gray-300 hover:underline">
              Team Members ({project.members.length})
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="mt-2 space-y-2">
                {project.members.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-md dark:bg-gray-700/50 bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-600/40 transition-colors"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={member.user?.profile_picture || ""} />
                      <AvatarFallback>
                        {member.user?.name?.[0] || member.user?.username?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex flex-col">
                      <Link
                        href={`/profile/${member.user?.username}`}
                        className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {member.user?.name || member.user?.username || "Unknown User"}
                      </Link>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {member.role} ({member.status})
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
