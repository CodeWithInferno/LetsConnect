// components/ProfileContent.jsx
'use client';

import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import ConnectGitHubButton from "./ConnectGitHubButton"; // Ensure this path is correct

export default function ProfileContent({ user, projects }) {
  return (
    <div className="space-y-8">
      {/* Profile Details Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Profile Details</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <span className="font-medium">Bio: </span>
            <span>{user?.bio || "No bio set."}</span>
          </div>
          <div>
            <span className="font-medium">Website: </span>
            <span>{user?.website || "Not provided"}</span>
          </div>
          <div>
            <span className="font-medium">Location: </span>
            <span>{user?.location || "Not provided"}</span>
          </div>
          <div>
            <span className="font-medium">Role: </span>
            <span>{user?.role || "N/A"}</span>
          </div>
          <div>
            <span className="font-medium">Skills: </span>
            <div className="flex flex-wrap gap-2 mt-1">
              {user?.skills?.map(({ skill }) => (
                <span
                  key={skill.id}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {skill.name}
                </span>
              ))}
              {(!user?.skills || user.skills.length === 0) && (
                <span className="text-gray-500">No skills added yet</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* GitHub Integration Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">GitHub Integration</h2>
        </CardHeader>
        <CardContent className="space-y-2">
          {user?.githubUsername ? (
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                {user.githubAvatar ? (
                  <AvatarImage src={user.githubAvatar} alt={user.githubUsername} />
                ) : (
                  <AvatarFallback>{user.githubUsername[0]}</AvatarFallback>
                )}
              </Avatar>
              <span className="font-medium">{user.githubUsername}</span>
            </div>
          ) : (
            <>
              <p>
                Connect your GitHub account to view your repositories, pull requests,
                and commit activity.
              </p>
              <ConnectGitHubButton />
            </>
          )}
        </CardContent>
      </Card>

      {/* Organizations Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Organizations</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {user?.organizations && user.organizations.length > 0 ? (
            user.organizations.map((org) => (
              <div key={org.id} className="flex items-center gap-4">
                <Avatar className="w-10 h-10">
                  {org.logo ? (
                    <AvatarImage src={org.logo} alt={org.name} />
                  ) : (
                    <AvatarFallback>{org.name[0]}</AvatarFallback>
                  )}
                </Avatar>
                <span className="font-medium">{org.name}</span>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              You are not a member of any organization.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Your Projects</h2>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects && projects.length > 0 ? (
            projects.map((proj) => (
              <div key={proj.id} className="p-4 border rounded-md hover:shadow-md">
                <h3 className="font-bold">{proj.title}</h3>
                <p className="text-gray-600 text-sm">
                  {proj.description || "No description provided."}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
