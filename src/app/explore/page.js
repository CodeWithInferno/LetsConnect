"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/explore/ProjectCard";
import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "@/components/explore/Navbar";

export default function ExplorePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProjects() {
      try {
        const query = `
          query {
            projects {
              id
              title
              description
              projectType
              skillsRequired
              deadline
              budget
              certificateEligible
              bannerImage
              owner {
                id
                username
                name
                email
                profile_picture
              }
              organization {
                id
                name
                logo
              }
              members {
                id
                role
                status
                user {
                  id
                  username
                  name
                  email
                  profile_picture
                }
              }
            }
          }
        `;
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query }),
        });
        const { data } = await response.json();
        if (data?.projects) {
          setProjects(data.projects);
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // Filter projects by title (case-insensitive)
  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50">
        <Navbar searchValue={searchQuery} onSearchChange={setSearchQuery} />
      </div>
      
      {/* LIGHT MODE BACKGROUND */}
      <div className="dark:hidden absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />
      
      {/* DARK MODE BACKGROUND */}
      <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />
      
      {/* Content: add top padding to avoid being hidden behind the sticky navbar */}
      <div className="p-6 pt-24">

        
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                currentUser={user} 
                className="transform transition-transform duration-300 hover:-translate-y-2"
              />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-600 dark:text-gray-400">
            No projects match your search.
          </div>
        )}
      </div>
    </div>
  );
}
