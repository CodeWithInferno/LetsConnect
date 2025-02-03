"use client";
import { useState, useEffect } from "react";
import { Menu, Sun, Moon, Search } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <nav className="fixed w-full h-16 flex items-center justify-between px-6 border-b bg-white dark:bg-gray-900 dark:border-gray-700 z-50">
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          <Menu className={`w-6 h-6 text-gray-600 dark:text-gray-300 transition-transform ${
            isSidebarOpen ? "rotate-0" : "rotate-180"
          }`} />
        </button>
        <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
          Project Dashboard
        </h1>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 w-64"
          />
        </div>

        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun className="w-6 h-6 text-yellow-400 animate-pulse" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600 animate-spin" />
            )
          ) : (
            <div className="w-6 h-6" />
          )}
        </button>
      </div>
    </nav>
  );
}