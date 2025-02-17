"use client";

import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Bell, Search, Filter, X } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";

// Shadcn UI avatar components
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Shadcn UI dropdown components
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { Skeleton } from "@/components/ui/skeleton";

/**
 * A tiny "debounce" hook so we only call the search after
 * the user stops typing for 'delay' ms.
 */
function useDebounce(value, delay = 500) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounced(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debounced;
}

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Track current user
  const [user, setUser] = useState(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [fetchError, setFetchError] = useState(null);

  // Local search state
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedTerm = useDebounce(searchTerm, 500);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const searchBoxRef = useRef(null);

  // Close results if clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Sticky navbar effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    setMounted(true);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch the current user on mount
  useEffect(() => {
    async function fetchUser() {
      setFetchLoading(true);
      setFetchError(null);
      try {
        const query = `
          query {
            myUser {
              id
              email
              name
              profile_picture
            }
          }
        `;
        const res = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query }),
        });
        const json = await res.json();
        if (json.errors) {
          throw new Error(json.errors[0].message || "Failed to fetch user");
        }
        setUser(json.data.myUser);
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setFetchError(err.message);
      } finally {
        setFetchLoading(false);
      }
    }
    fetchUser();
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (!debouncedTerm) {
      setSearchResults([]);
      return;
    }
    doGlobalSearch(debouncedTerm);
  }, [debouncedTerm]);

  async function doGlobalSearch(term) {
    try {
      const query = `
query GlobalSearch($term: String!) {
  globalSearch(term: $term) {
    __typename
    ... on User {
      id
      name
      username
    }
    ... on Organization {
      id
      name
      logo
      # no slug
    }
    ... on Project {
      id
      title
      # no slug
    }
  }
}

      `;
      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, variables: { term } }),
      });
      const json = await res.json();
      if (json.errors) {
        console.error("GlobalSearch error:", json.errors);
        return;
      }
      setSearchResults(json.data.globalSearch);
      setShowSearchResults(true);
    } catch (error) {
      console.error("GlobalSearch fetch error:", error);
    }
  }

  // Group results by type
  const orgResults = searchResults.filter(
    (r) => r.__typename === "Organization"
  );
  const userResults = searchResults.filter((r) => r.__typename === "User");
  const projectResults = searchResults.filter(
    (r) => r.__typename === "Project"
  );

  return (
    <nav
      className={`
        fixed top-0 left-0 right-0 z-50 
        ${
          scrolled
            ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-md"
            : "bg-transparent"
        }
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
      <div className="flex flex-1 justify-center" ref={searchBoxRef}>
  <div className="relative w-full max-w-md">
    <input
      type="text"
      placeholder="Search..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      onFocus={() => {
        if (searchResults.length > 0) setShowSearchResults(true);
      }}
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

    {/* Only show the dropdown if we have results and the user is focused */}
    {showSearchResults && searchResults.length > 0 && (
      <div
        className="
          absolute top-10 left-0 w-full
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg shadow-lg
          mt-2 overflow-hidden
        "
      >
        <div className="max-h-64 overflow-y-auto text-sm">
          {/* ORGANIZATIONS */}
          {orgResults.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Organizations
              </div>
              {orgResults.map((org) => (
                <Link
                  key={org.id}
                  href={`/organization/${org.id}`} 
                  onClick={() => setShowSearchResults(false)}
                >
                  <div
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {org.name}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* USERS (Profiles) */}
          {userResults.length > 0 && (
            <div className="border-b border-gray-200 dark:border-gray-700">
              <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Profiles
              </div>
              {userResults.map((u, idx) => (
                <Link
                  key={`user-${u.id}-${idx}`}
                  href={`/profile/${u.username || u.id}`} 
                  onClick={() => setShowSearchResults(false)}
                >
                  <div
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {u.name || u.username}
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* PROJECTS */}
          {projectResults.length > 0 && (
            <div>
              <div className="px-4 py-2 font-semibold text-gray-700 dark:text-gray-300">
                Projects
              </div>
              {projectResults.map((project, idx) => (
                <Link
                  key={`project-${project.id}-${idx}`}
                  href={`/project/${project.id}`}
                  onClick={() => setShowSearchResults(false)}
                >
                  <div
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  >
                    {project.title}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )}
  </div>
</div>


      {/* Right: Notification, Theme Toggle, and User Avatar */}
      <div className="flex items-center gap-2">
        <Link href="/notifications">
          <button
            className="
              p-2 rounded-full 
              hover:bg-gray-200/50 dark:hover:bg-gray-700/50 
              focus:outline-none focus:ring-2 focus:ring-blue-500
              transition-colors
            "
          >
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

        {/* Show user avatar + dropdown */}
        {fetchLoading ? (
          <Skeleton className="w-8 h-8 rounded-full" />
        ) : fetchError ? (
          <div className="text-sm text-red-500">{fetchError}</div>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                <Avatar>
                  <AvatarImage
                    src={user.profile_picture || "/placeholder.svg"}
                  />
                  <AvatarFallback>
                    {(user.name || user.email)[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-52">
              <DropdownMenuLabel className="leading-tight">
                <p className="font-medium">{user.name || "No Name"}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {user.email}
                </p>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Dashboard</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Link href="/api/auth/login">
            <button className="text-sm text-blue-600 dark:text-blue-400">
              Login
            </button>
          </Link>
        )}
      </div>

      {/* Filter Dropdown (Placeholder) */}
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
              <label className="block text-sm font-medium mb-2">
                Project Type
              </label>
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
              <label className="block text-sm font-medium mb-2">
                Certificate
              </label>
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
