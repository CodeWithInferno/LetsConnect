"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/settings/ProfileHeader";
import ProfileContent from "@/components/settings/ProfileContent";

export default function SettingsPage() {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { user: authUser, isLoading: authLoading } = useUser();
  const router = useRouter();

  // Redirect to login if not logged in
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/api/auth/login");
    }
  }, [authUser, authLoading, router]);

  // Fetch data once the Auth0 user is available
  useEffect(() => {
    if (!authLoading && authUser?.email) {
      fetchData();
    }
  }, [authUser, authLoading]);

  async function fetchData() {
    setLoading(true);
    try {
      const query = `
        query {
          myProfile {
            id
            name
            email
            username
            profile_picture
            role
            bio
            website
            location
            organizations {
              id
              name
              logo
            }
            skills {
              skill {
                id
                name
              }
            }
          githubUsername
          githubAvatar  
          }
          myProjects {
            id
            title
            description
          }
        }
      `;

      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query }),
      });

      const { data, errors } = await response.json();
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      setUserData(data.myProfile);
      setProjects(data.myProjects);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <ProfileHeader user={userData} />
      <ProfileContent user={userData} projects={projects} />
    </div>
  );
}
