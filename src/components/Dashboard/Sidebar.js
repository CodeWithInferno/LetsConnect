"use client";

import { Home, Settings, Users, Github, LayoutGrid } from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useState } from "react";

export default function Sidebar({ isOpen, isMobile, toggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const { user } = useUser(); // Get user from Auth0
  const [userData, setUserData] = useState(null);
  const projectId = params.projectId;

  const isProjectDashboard = pathname.startsWith("/dashboard/manage/") && projectId;

  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.email) {
        console.log("Auth0 user not available yet.");
        return;
      }

      console.log("Fetching GraphQL User Data for:", user.email);

      const query = `
        query GetUserProfile {
          user {
            name
            email
            profile_picture
          }
        }
      `;

      try {
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        console.log("GraphQL Response:", result); // Debugging log

        if (!response.ok || result.errors) {
          console.error("GraphQL Error:", result.errors || "Failed request");
          return;
        }

        setUserData(result.data.user);
      } catch (err) {
        console.error("API Fetch Error:", err);
      }
    }

    fetchUserProfile();
  }, [user?.email]);

  const menuItems = [
    { icon: Home, label: "Dashboard", path: isProjectDashboard ? `/dashboard/manage/${projectId}` : "/dashboard" },
    { icon: Users, label: "Team", path: isProjectDashboard ? `/dashboard/manage/${projectId}/teams` : "/teams" },
    { icon: Github, label: "Github", path: isProjectDashboard ? `/dashboard/manage/${projectId}/github` : "/github" },
    ...(isProjectDashboard ? [{ icon: LayoutGrid, label: "Kanban", path: `/dashboard/manage/${projectId}/kanban` }] : []),
    { icon: Settings, label: "Settings", path: isProjectDashboard ? `/dashboard/manage/${projectId}/settings` : "/settings" },
  ];

  const handleNavigation = (path) => {
    router.push(path);
    if (isMobile) {
      toggle();
    }
  };

  return (
    <aside
      className={`fixed top-16 h-[calc(100vh-4rem)] bg-white dark:bg-gray-900 border-r dark:border-gray-700 z-40 transition-all duration-300
        ${isMobile ? "w-64" : isOpen ? "w-64" : "w-20"} 
        ${isOpen ? "left-0" : "-left-full md:left-0"}`}
    >
      <div className="p-4 space-y-2 h-full flex flex-col">
        {/* Sidebar Menu Items */}
        {menuItems.map((item) => (
          <button
            key={item.label}
            onClick={() => handleNavigation(item.path)}
            className={`flex items-center w-full p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors
              ${isOpen ? "px-4 justify-start gap-4" : "justify-center"}`}
          >
            <item.icon className={`shrink-0 ${isOpen ? "w-6 h-6" : "w-7 h-7"} text-gray-600 dark:text-gray-300`} />
            {isOpen && (
              <span className="text-gray-700 dark:text-gray-200 font-medium truncate">
                {item.label}
              </span>
            )}
          </button>
        ))}

        <div className="flex-1" />

        {/* User Profile Section */}
        {userData ? (
          <div className="border-t dark:border-gray-700 pt-4 flex items-center gap-4 p-2">
            <Avatar>
              <AvatarImage src={userData.profile_picture || user?.picture || "/default-avatar.png"} />
              <AvatarFallback>{userData?.name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            {isOpen && (
              <div className="flex flex-col">
                <span className="text-gray-700 dark:text-gray-200 font-medium">{userData?.name || user?.name}</span>
                <span className="text-gray-500 dark:text-gray-400 text-sm">{userData?.email || user?.email}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-gray-500 dark:text-gray-400">Loading user...</span>
          </div>
        )}
      </div>
    </aside>
  );
}
