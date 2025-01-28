'use client';
import { useEffect, useState } from "react";
import ProjectCard from "@/components/explore/ProjectCard";

export default function ExplorePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/project/explore/fetch");
        const data = await response.json();
        setProjects(data); // Store the fetched projects
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  if (loading) {
    return <div>Loading projects...</div>;
  }

  if (!projects.length) {
    return <div>No projects found.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
      {/* Masonry Grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="break-inside-avoid">
            <ProjectCard project={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
