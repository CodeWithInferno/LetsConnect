// 'use client';
// import { useEffect, useState } from "react";
// import ProjectCard from "@/components/explore/ProjectCard";

// export default function ExplorePage() {
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchProjects() {
//       try {
//         const response = await fetch("/api/project/explore/fetch");
//         const data = await response.json();
//         setProjects(data); // Store the fetched projects
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching projects:", error);
//         setLoading(false);
//       }
//     }

//     fetchProjects();
//   }, []);

//   if (loading) {
//     return <div>Loading projects...</div>;
//   }

//   if (!projects.length) {
//     return <div>No projects found.</div>;
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
//       {/* Masonry Grid */}
//       <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
//         {projects.map((project) => (
//           <div key={project.id} className="break-inside-avoid">
//             <ProjectCard project={project} />
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }



"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/explore/ProjectCard";
import { useUser } from "@auth0/nextjs-auth0/client";


export default function ExplorePage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);


  const { user } = useUser();


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
    return <div className="p-6">Loading projects...</div>;
  }

  if (!projects.length) {
    return <div className="p-6">No projects found.</div>;
  }

  return (
    <div className="relative min-h-screen p-6">
      {/* LIGHT MODE BACKGROUND */}
      <div className="dark:hidden absolute inset-0 -z-10 h-full w-full bg-white bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px]" />

      {/* DARK MODE BACKGROUND */}
      <div className="hidden dark:block absolute inset-0 -z-10 h-full w-full bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]" />

      <h1 className="text-3xl font-bold mb-6">Explore Projects</h1>
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
        {projects.map((project) => (
          <div key={project.id} className="break-inside-avoid">
          {/* 3. Pass `currentUser={user}` so the card knows who’s logged in */}
          <ProjectCard project={project} currentUser={user} />
        </div>
        ))}
      </div>
    </div>
  );
}
