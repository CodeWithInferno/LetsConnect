"use client";
import { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) setIsSidebarOpen(true);
    };
    
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    if (!isMobile) {
      setIsSidebarOpen(!isSidebarOpen);
    } else {
      setIsSidebarOpen(prev => !prev);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900">
      <Navbar 
        toggleSidebar={toggleSidebar} 
        isSidebarOpen={isSidebarOpen}
      />
      
      <div className="flex flex-1 pt-16 overflow-hidden">
        <Sidebar 
          isOpen={isSidebarOpen} 
          isMobile={isMobile} 
          toggle={toggleSidebar} 
        />
        
        <main className={`flex-1 p-4 transition-margin duration-300 ${isSidebarOpen ? "ml-64" : "ml-20"}`}>
  {children}
</main>
      </div>
    </div>
  );
}