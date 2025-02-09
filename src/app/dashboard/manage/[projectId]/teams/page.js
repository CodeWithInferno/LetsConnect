"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Layout from "@/components/Dashboard/Layout";

import { Loader2, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import TeamTable from "@/components/Dashboard/Teams/TeamTable";
import InviteMemberModal from "@/components/Dashboard/Teams/InviteMemberModal";

export default function TeamManagement() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // 1. Check if user is logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  // 2. Load the project
  useEffect(() => {
    if (!userLoading && user && params.projectId) {
      fetchProjectDetails(params.projectId);
    }
  }, [user, userLoading, params.projectId]);

  async function fetchProjectDetails(id) {
    try {
      setLoading(true);
      const query = `
        query MyProject($projectId: String!) {
          myProject(projectId: $projectId) {
            id
            title
            members {
              id
              role
              status
              user {
                id
                name
                email
                profile_picture
              }
            }
          }
        }
      `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query, variables: { projectId: id } }),
      });

      const { data, errors } = await res.json();
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      if (!data?.myProject) {
        // If no project is returned, go back or handle not found
        router.push("/dashboard");
        return;
      }

      setProject(data.myProject);
    } catch (err) {
      console.error("Error fetching project:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  // Callback used to refresh membership data from children
  const handleRefresh = async () => {
    if (!project?.id) return;
    await fetchProjectDetails(project.id);
  };

  // 3. Invite member mutation
  async function handleInviteMember(email, role) {
    try {
      setInviteError("");
      setInviteLoading(true);

      const mutation = `
        mutation InviteMember($projectId: String!, $email: String!, $role: String!) {
          inviteMemberToProject(projectId: $projectId, email: $email, role: $role) {
            id
            role
            user {
              id
              name
              email
            }
          }
        }
      `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: mutation,
          variables: {
            projectId: params.projectId,
            email,
            role,
          },
        }),
      });

      const { data, errors } = await res.json();
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      // After inviting, refresh the members list
      await handleRefresh();

      // Close modal
      setInviteOpen(false);
    } catch (err) {
      setInviteError(err.message);
    } finally {
      setInviteLoading(false);
    }
  }

  // Filter members
  const filteredMembers = () => {
    if (!project?.members) return [];
    return project.members.filter(
      (m) =>
        m.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Show a spinner while loading
  if (userLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </Layout>
    );
  }

  // 4. Render
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage team members for {project?.title}
            </p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table of members */}
        <TeamTable 
          members={filteredMembers()} 
          // Pass handleRefresh so we can re-fetch from TeamTable
          onRefresh={handleRefresh}
        />
      </div>

      {/* Invite Member Modal */}
      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        loading={inviteLoading}
        error={inviteError}
        onInvite={handleInviteMember}
        defaultRole="MEMBER"
      />
    </Layout>
  );
}
