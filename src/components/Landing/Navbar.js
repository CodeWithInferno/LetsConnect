"use client";

import React, { useState } from "react";
import { useAuthUser } from "@/context/AuthUserContext";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, userInfo, isLoading } = useAuthUser();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="flex items-center justify-between p-4 sticky top-0 z-50 bg-black/5 backdrop-blur-md border-b border-gray-800/50 supports-[backdrop-filter]:bg-black/5">
      {/* Left Side: Logo */}
      <div className="flex items-center">
        <span className="text-white font-bold text-xl">Lets Connect</span>
      </div>

      {/* Center: Navigation Links (Hidden on Mobile) */}
      <div className="hidden md:flex space-x-6">
        <a href="#about" className="text-gray-300 hover:text-white transition-colors">
          About
        </a>
        <a href="#features" className="text-gray-300 hover:text-white transition-colors">
          Features
        </a>
        <a href="#contribute" className="text-gray-300 hover:text-white transition-colors">
          contribute
        </a>
        <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
          Contact
        </a>
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
                <AvatarFallback>
                  {userInfo?.username?.charAt(0) || user?.name?.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 bg-gray-900/95 backdrop-blur-lg text-white border border-gray-700"
            >
              <DropdownMenuItem asChild>
                <a
                  href="/dashboard"
                  className="block w-full px-2 py-1 hover:bg-gray-800/80"
                >
                  Dashboard
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/settings"
                  className="block w-full px-2 py-1 hover:bg-gray-800/80"
                >
                  Settings
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a
                  href="/api/auth/logout"
                  className="block w-full px-2 py-1 hover:bg-gray-800/80"
                >
                  Logout
                </a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <>
            <Button
              variant="outline"
              className="text-white border-gray-700 hover:bg-gray-700/50 backdrop-blur-lg"
              asChild
            >
              <a href="/api/auth/login">Login</a>
            </Button>
            <Button
              variant="default"
              className="bg-blue-600 text-white hover:bg-blue-700 backdrop-blur-lg"
              asChild
            >
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
        <div className="absolute top-16 right-4 bg-gray-900/95 backdrop-blur-lg border border-gray-700 rounded-lg w-48 shadow-lg md:hidden">
          <a
            href="#about"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            About
          </a>
          <a
            href="#features"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            Features
          </a>
          <a
            href="#contribute"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            Contribute
          </a>
          <a
            href="#contact"
            className="block px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800/50"
          >
            Contact
          </a>
        </div>
      )}
    </nav>
  );
}
