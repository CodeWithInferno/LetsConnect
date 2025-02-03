// components/ProfileHeader.jsx
'use client';

import React from "react";
import { Edit } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default function ProfileHeader({ user }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          {user?.profile_picture ? (
            <AvatarImage src={user.profile_picture} alt={user.name} />
          ) : (
            <AvatarFallback>{user?.name?.[0] || "U"}</AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-2xl font-bold">{user?.name || "No Name"}</h1>
          <p className="text-sm text-gray-500">@{user?.username}</p>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
        <Button variant="outline" className="ml-auto">
          <Edit className="mr-2 h-4 w-4" /> Edit Profile
        </Button>
      </div>
    </Card>
  );
}
