"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Dashboard/Layout";
import ProjectHeader from "@/components/Dashboard/cards/ProjectHeader";
import ProjectMetrics from "@/components/Dashboard/cards/ProjectMetrics";
import KanbanSection from "@/components/Dashboard/cards/KanbanSection";

const GET_PROJECT_QUERY = `
  query MyProject($projectId: String!) {
    myProject(projectId: $projectId) {
      id
      title
      description
      budget
      owner {
        id
        name
      }
      members {
        id
        role
      }
    }
  }
`;

const GET_KANBAN_BOARD_QUERY = `
  query GetKanbanBoard($projectId: ID!) {
    kanbanBoard(projectId: $projectId) {
      id
      columns {
        id
        title
        color
        order
        tasks {
          id
          content
          priority
          dueDate
          tags
        }
      }
    }
  }
`;

const fallbackColumns = {
  todo: {
    name: "To Do",
    color: "#6366F1",
    tasks: [],
  },
  inprogress: {
    name: "In Progress",
    color: "#EC4899",
    tasks: [],
  },
  done: {
    name: "Done",
    color: "#10B981",
    tasks: [],
  },
};

export default function ProjectView() {
  const router = useRouter();
  const { projectId } = useParams();
  const { user, isLoading: userLoading } = useUser();
  
  const [project, setProject] = useState(null);
  const [kanbanColumns, setKanbanColumns] = useState(fallbackColumns);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Redirect to login if user not logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [userLoading, user, router]);

  // Once user and projectId are available, fetch project and kanban board data
  useEffect(() => {
    if (projectId && user) {
      fetchProject();
      fetchKanbanBoard();
    }
  }, [projectId, user]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: GET_PROJECT_QUERY,
          variables: { projectId },
        }),
      });
      const { data, errors } = await res.json();
      if (errors) throw new Error(errors[0].message);
      setProject(data?.myProject || null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchKanbanBoard = async () => {
    try {
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: GET_KANBAN_BOARD_QUERY,
          variables: { projectId },
        }),
      });
      const { data, errors } = await res.json();
      if (errors) throw new Error(errors[0].message);
      
      const transformedColumns = data?.kanbanBoard?.columns?.reduce((acc, column) => {
        acc[column.id] = {
          name: column.title,
          color: column.color,
          tasks: column.tasks.map(task => ({
            id: task.id,
            content: task.content,
            priority: task.priority,
            dueDate: task.dueDate,
            tags: task.tags,
          })),
        };
        return acc;
      }, {});
      
      if (transformedColumns) {
        setKanbanColumns(transformedColumns);
      }
    } catch (err) {
      console.error("Error fetching kanban board:", err);
    }
  };

  // No onTaskDragEnd function is provided because editing is disabled in this view.

  if (userLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-gray-500">Project not found</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* ProjectHeader without any settings/edit button */}
        <ProjectHeader project={project} />
        <ProjectMetrics project={project} />
        {/* KanbanSection rendered in read-only mode.
            If KanbanSection supports a readOnly prop, pass it; otherwise, ensure it doesn't allow editing */}
        <KanbanSection columns={kanbanColumns} readOnly={true} />
      </div>
    </Layout>
  );
}
