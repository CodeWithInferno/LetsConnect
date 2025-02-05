"use client";

import React from "react";
import { useAuthUser } from "@/context/AuthUserContext"; // Use our custom context
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react"; // Icons for mobile menu
import { useState } from "react";

export default function Navbar() {
  const { user, userInfo, isLoading } = useAuthUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 bg-transparent border-b border-gray-800 sticky top-0 z-50">
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <span className="text-white font-bold text-xl">Lets Connect</span>
      </div>

      {/* Center: Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex space-x-6">
        <a href="/about" className="text-gray-300 hover:text-white">About</a>
        <a href="/features" className="text-gray-300 hover:text-white">Features</a>
        <a href="/pricing" className="text-gray-300 hover:text-white">Pricing</a>
        <a href="/contact" className="text-gray-300 hover:text-white">Contact</a>
      </div>

      {/* Right Side: Authentication & Actions */}
      <div className="flex items-center space-x-4">
        {isLoading ? (
          <p className="text-gray-300">Loading...</p>
        ) : user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={userInfo?.profile_picture || user?.picture}
                  alt={userInfo?.username || user?.name}
                />
                <AvatarFallback>{userInfo?.username?.charAt(0) || user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-gray-900 text-white border border-gray-700">
              <DropdownMenuItem asChild>
                <a href="/dashboard" className="block w-full px-2 py-1 hover:bg-gray-800">Dashboard</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/settings" className="block w-full px-2 py-1 hover:bg-gray-800">Settings</a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href="/api/auth/logout" className="block w-full px-2 py-1 hover:bg-gray-800">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-700" asChild>
              <a href="/api/auth/login">Login</a>
            </Button>
            <Button variant="default" className="bg-blue-600 text-white hover:bg-blue-700" asChild>
              <a href="/api/auth/login">Get Started</a>
            </Button>
          </>
        )}

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 right-4 bg-gray-900 border border-gray-700 rounded-lg w-48 shadow-lg md:hidden">
          <a href="/about" className="block px-4 py-2 text-gray-300 hover:text-white">About</a>
          <a href="/features" className="block px-4 py-2 text-gray-300 hover:text-white">Features</a>
          <a href="/pricing" className="block px-4 py-2 text-gray-300 hover:text-white">Pricing</a>
          <a href="/contact" className="block px-4 py-2 text-gray-300 hover:text-white">Contact</a>
        </div>
      )}
    </nav>
  );
}
