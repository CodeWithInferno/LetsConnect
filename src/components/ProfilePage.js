// components/profile/ProfileLayout.js
"use client";

import Navbar from "@/components/Navbar";
import { Star, Forklift, Dot, Search } from "lucide-react";

const dummyProjects = [
  {
    name: "awesome-project",
    description: "A really awesome project that solves all your problems",
    language: "TypeScript",
    stars: 2541,
    forks: 432,
    updated: "3 days ago"
  },
  {
    name: "nextjs-boilerplate",
    description: "Modern Next.js 14+ template with all the bells and whistles",
    language: "JavaScript",
    stars: 892,
    forks: 156,
    updated: "1 week ago"
  },
  {
    name: "design-system",
    description: "Custom UI component library built with Tailwind CSS",
    language: "CSS",
    stars: 456,
    forks: 89,
    updated: "2 days ago"
  },
];

export default function ProfileLayout({ data }) {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Main Content Container */}
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Left Sidebar (Avatar Section) */}
        <div 
          className="w-full lg:w-auto lg:min-w-[260px]"
          style={{
            paddingLeft: '20px',
            paddingTop: '50px',
            position: 'sticky',
            top: '80px',
            alignSelf: 'flex-start'
          }}
        >
          {/* Avatar Container */}
          <div className="space-y-4">
            <div className="h-48 w-48 rounded-full border-2 border-gray-200 dark:border-gray-600 p-1 mx-auto lg:mx-0">
              <div className="h-full w-full rounded-full overflow-hidden bg-gray-100 dark:bg-gray-800">
                {data?.profile_picture ? (
                  <img
                    src={data.profile_picture}
                    alt={`${data?.name}'s profile`}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-4xl font-bold text-gray-500 dark:text-gray-400">
                    {(data?.name?.[0] || data?.username?.[0] || 'U')}
                  </div>
                )}
              </div>
            </div>

            {/* Name & Username */}
            <div className="text-center lg:text-left space-y-1">
              <h1 className="text-2xl font-bold break-words">
                {data?.name || 'Anonymous User'}
              </h1>
              <p className="text-lg text-muted-foreground break-words">
                @{data?.username || 'unknown'}
              </p>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 py-8">
          {/* Navigation Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div className="flex gap-4">
              <button className="text-sm font-semibold border-b-2 border-primary">
                Overview
              </button>
              <button className="text-sm text-muted-foreground hover:text-foreground transition">
                Repositories
              </button>
            </div>
            
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Find a repository..."
                className="w-full pl-10 pr-4 py-2 text-sm rounded-md border bg-transparent"
              />
            </div>
          </div>

          {/* Project Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {dummyProjects.map((project, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:border-primary/30 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-semibold text-primary truncate">
                      {project.name}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      Updated {project.updated}
                    </span>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="mt-auto flex items-center gap-4 text-xs">
                    {project.language && (
                      <div className="flex items-center gap-1">
                        <Dot className="h-4 w-4" style={{ color: getLanguageColor(project.language) }} />
                        <span>{project.language}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      <span>{project.stars.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Forklift className="h-4 w-4" />
                      <span>{project.forks.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button className="col-span-1 md:col-span-2 p-4 border-2 border-dashed rounded-lg hover:border-primary/30 hover:bg-accent/10 transition-colors">
              <div className="text-center text-muted-foreground text-sm">
                New project
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Language color mapping function
const getLanguageColor = (language) => {
  const colors = {
    TypeScript: "#3178c6",
    JavaScript: "#f1e05a",
    CSS: "#563d7c",
    Python: "#3572A5",
    HTML: "#e34c26",
    Ruby: "#701516",
    Java: "#b07219",
    PHP: "#4F5D95",
    Go: "#00ADD8",
    Rust: "#dea584"
  };
  return colors[language] || "#cccccc";
};