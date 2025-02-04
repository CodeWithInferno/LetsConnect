"use client";
import { useState, useEffect } from "react";
import { Sun, Moon, Bell, Search, Filter, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

export default function Navbar({searchValue, onSearchChange}) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    setMounted(true);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav 
      className={`
        fixed top-0 left-0 right-0 z-50 
        ${scrolled 
          ? 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md' 
          : 'bg-transparent'}
        transition-all duration-300 ease-in-out
        w-full h-16 flex items-center justify-between px-6
      `}
    >
      {/* Left: Filter Button */}
      <div>
        <button 
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="
            p-2 rounded-full 
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
          "
        >
          {isFilterOpen ? (
            <X size={24} className="text-gray-700 dark:text-gray-300" />
          ) : (
            <Filter size={24} className="text-gray-700 dark:text-gray-300" />
          )}
        </button>
      </div>

      {/* Center: Search Input */}
      <div className="flex flex-1 justify-center">
        <div className="relative w-full max-w-md">
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="
              w-full py-2 pl-10 pr-4 
              rounded-full 
              bg-gray-100/50 dark:bg-gray-800/50 
              border border-gray-200 dark:border-gray-700
              text-gray-800 dark:text-gray-200 
              focus:outline-none focus:ring-2 focus:ring-blue-500 
              backdrop-blur-sm
              transition-all duration-300
            "
          />
          <Search 
            size={20} 
            className="
              absolute left-3 top-1/2 transform -translate-y-1/2 
              text-gray-500 dark:text-gray-400
            " 
          />
        </div>
      </div>

      {/* Right: Notification & Theme Toggle */}
      <div className="flex items-center gap-2">
        <Link href="/notifications">
          <button className="
            p-2 rounded-full 
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
          ">
            <Bell size={24} className="text-gray-700 dark:text-gray-300" />
          </button>
        </Link>
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="
            p-2 rounded-full 
            hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
            focus:outline-none focus:ring-2 focus:ring-blue-500
            transition-colors
          "
        >
          {mounted ? (
            theme === "dark" ? (
              <Sun size={24} className="text-yellow-500" />
            ) : (
              <Moon size={24} className="text-gray-700 dark:text-gray-300" />
            )
          ) : (
            <div className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Filter Dropdown (Non-functional Placeholder) */}
      {isFilterOpen && (
        <div 
          className="
            absolute top-16 left-4 
            w-64 
            bg-white dark:bg-gray-800 
            border border-gray-200 dark:border-gray-700 
            rounded-lg 
            shadow-lg 
            p-4
            transition-all duration-300
          "
        >
          <h3 className="text-lg font-semibold mb-4">Filters</h3>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium mb-2">Project Type</label>
              <select 
                className="
                  w-full 
                  py-2 px-3 
                  rounded-md 
                  bg-gray-100 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                "
              >
                <option>All Types</option>
                <option>Web Development</option>
                <option>Mobile App</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Certificate</label>
              <select 
                className="
                  w-full 
                  py-2 px-3 
                  rounded-md 
                  bg-gray-100 dark:bg-gray-700
                  border border-gray-300 dark:border-gray-600
                "
              >
                <option>All</option>
                <option>Certificate Eligible</option>
                <option>Not Certificate Eligible</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}