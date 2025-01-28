"use client";
import { useState, useEffect } from "react";
import { Menu, Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  
  // Ensure theme icons only render after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <nav className="w-full h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 bg-background text-foreground">
      <button
        className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500"
      >
        <Menu size={24} />
      </button>

      <div className="flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          className="bg-transparent outline-none text-gray-800 dark:text-gray-200 placeholder-gray-400"
        />
      </div>

      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="p-2 rounded-md focus:outline-none"
      >
        {mounted ? (
          theme === "dark" ? (
            <Sun size={24} />
          ) : (
            <Moon size={24} />
          )
        ) : (
          <div className="h-6 w-6" /> // Empty placeholder
        )}
      </button>
    </nav>
  );
}