"use client";

import { Home, Settings, Users, FileText, Calendar, LayoutGrid } from "lucide-react";
import { useRouter, usePathname, useParams } from "next/navigation";

export default function Sidebar({ isOpen, isMobile, toggle }) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const projectId = params.projectId; // Automatically extract projectId from URL

  // Determine if we're inside a project (i.e., under `/dashboard/manage/[projectId]`)
  const isProjectDashboard = pathname.startsWith("/dashboard/manage/") && projectId;

  // Define Sidebar Menu Items.
  // When in project dashboard, we add a Kanban menu item.
  const menuItems = [
    { icon: Home, label: "Dashboard", path: isProjectDashboard ? `/dashboard/manage/${projectId}` : "/dashboard" },
    { icon: Users, label: "Team", path: isProjectDashboard ? `/dashboard/manage/${projectId}/teams` : "/teams" },
    { icon: FileText, label: "Projects", path: "/projects" },
    { icon: Calendar, label: "Calendar", path: isProjectDashboard ? `/dashboard/manage/${projectId}/calendar` : "/calendar" },
    // Conditionally add the Kanban menu item if we're in a project context.
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
        <div className="border-t dark:border-gray-700 pt-4">
          <div className={`text-center text-sm text-gray-500 dark:text-gray-400 ${!isOpen && "hidden"}`}>
            v1.0.0
          </div>
        </div>
      </div>
    </aside>
  );
}
