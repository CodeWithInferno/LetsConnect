"use client";
import { useEffect, useState } from "react";
import ProjectCard from "@/components/explore/ProjectCard";
import { useUser } from "@auth0/nextjs-auth0/client";
import Navbar from "@/components/explore/Navbar";
import { rankProjects } from "@/lib/rankProjects"; // Adjust the import path as needed

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
            skillsRequired { name } # ✅ Fetch skills
            languages { name } # ✅ Fetch programming languages
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
  
        const json = await response.json();
        console.log("🔍 GraphQL Response:", json);
  
        if (json.errors) {
          console.error("❌ GraphQL Errors:", json.errors);
        }
  
        if (json?.data?.projects) {
          setProjects(json.data.projects);
        } else {
          console.error("❌ No projects returned from API.");
        }
      } catch (error) {
        console.error("❌ Error fetching projects:", error);
      } finally {
        setLoading(false);
      }
    }
  
    fetchProjects();
  }, []);
  
  
  
  

  function scoreProjectForUser(user, project) {
    console.log("📌 Scoring project:", project.title);
    console.log("🔍 User interests:", user.interests);
    console.log("🔍 User skills:", user.skills);
    console.log("🔍 User programmingLanguages:", user.programmingLanguages);
  
    let score = 0;
  
    // Score based on user's interests (if provided)
    if (user.interests) {
      const interests = user.interests
        .toLowerCase()
        .split(",")
        .map((s) => s.trim());
  
      interests.forEach((interest) => {
        if (project.title.toLowerCase().includes(interest)) {
          score += 3;
          console.log(`✅ Interest Match: ${interest} in title`);
        }
        if (project.description.toLowerCase().includes(interest)) {
          score += 2;
          console.log(`✅ Interest Match: ${interest} in description`);
        }
      });
    }
  
    // Score based on user's skills (if available)
    if (user.skills && Array.isArray(user.skills)) {
      const userSkillNames = user.skills.map((skill) => skill.name.toLowerCase());
  
      if (Array.isArray(project.skillsRequired)) {
        project.skillsRequired.forEach((reqSkill) => {
          if (typeof reqSkill === "string") reqSkill = { name: reqSkill }; // 🔥 Fix potential issue
          if (userSkillNames.includes(reqSkill.name.toLowerCase())) {
            score += 5;
            console.log(`✅ Skill Match: ${reqSkill.name}`);
          }
        });
      }
    }
  
    // Score based on user's programming languages (if available)
    if (user.programmingLanguages && Array.isArray(user.programmingLanguages)) {
      const userLanguages = user.programmingLanguages.map((lang) => lang.toLowerCase());
  
      if (Array.isArray(project.languages)) {
        project.languages.forEach((lang) => {
          if (typeof lang === "string") lang = { name: lang }; // 🔥 Fix potential issue
          if (userLanguages.includes(lang.name.toLowerCase())) {
            score += 3;
            console.log(`✅ Language Match: ${lang.name}`);
          }
        });
      }
    }
  
    console.log(`📌 Final score for '${project.title}':`, score);
    return score;
  }
  

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  // First filter by search query
  const filteredProjects = searchQuery.trim()
  ? projects.filter((project) =>
      project.title?.toLowerCase().includes(searchQuery.toLowerCase())
    )
  : projects;

  console.log("📌 Filtered Projects:", filteredProjects); // ✅ Log the filtered projects


  // Then rank the filtered projects based on user preferences
  const rankedProjects = user
    ? rankProjects(user, filteredProjects)
    : filteredProjects;

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
      <div className="container mx-auto p-6 pt-24">
        <h1 className="text-3xl font-bold mb-6 text-center">Explore Projects</h1>
        
        {rankedProjects.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedProjects.map((project) => (
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
