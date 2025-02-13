"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { User, Settings, Paintbrush, Bell, CreditCard, Mail, Lock, Timer, Key, Building2, Building, Shield, Code2, Box, Package } from 'lucide-react'
import React from 'react'

const navigation = [
  {
    title: "User settings",
    items: [
      { title: "Public profile", href: "/settings/profile", icon: User },
      { title: "Account", href: "/settings/account", icon: Settings },
      { title: "Appearance", href: "/settings/appearance", icon: Paintbrush },
      { title: "Accessibility", href: "/settings/accessibility", icon: User },
      { title: "Notifications", href: "/settings/notifications", icon: Bell },
    ],
  },
  {
    title: "Access", 
    items: [
      { title: "Billing and plans", href: "/settings/billing", icon: CreditCard },
      { title: "Emails", href: "/settings/emails", icon: Mail },
      { title: "Password and authentication", href: "/settings/auth", icon: Lock },
      { title: "Sessions", href: "/settings/sessions", icon: Timer },
      { title: "SSH and GPG keys", href: "/settings/keys", icon: Key },
      { title: "Organizations", href: "/settings/organizations", icon: Building2 },
      { title: "Enterprises", href: "/settings/enterprises", icon: Building },
      { title: "Moderation", href: "/settings/moderation", icon: Shield },
    ],
  },
  {
    title: "Code, planning, and automation",
    items: [
      { title: "Repositories", href: "/settings/repositories", icon: Code2 },
      { title: "Codespaces", href: "/settings/codespaces", icon: Box },
      { title: "Packages", href: "/settings/packages", icon: Package },
    ],
  },
]

export default function SettingsLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#0D1117] text-white">
      <aside className="w-64 border-r border-[#21262D] p-4">
        <nav className="space-y-8">
          {navigation.map((section) => (
            <div key={section.title}>
              <h2 className="mb-2 px-2 text-xs font-semibold text-[#7D8590]">
                {section.title}
              </h2>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-[#7D8590] hover:bg-[#21262D]",
                        pathname === item.href && "bg-[#21262D] text-white"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      {item.title}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
