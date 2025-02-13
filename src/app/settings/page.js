"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Loader2 } from "lucide-react";
import ProfileHeader from "@/components/settings/ProfileHeader";
import ProfileContent from "@/components/settings/ProfileContent";
import EditProfileForm from "@/components/settings/EditableProfile";

export default function SettingsPage() {
  const [userData, setUserData] = useState(null);
  const [projects, setProjects] = useState([]);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { user: authUser, isLoading: authLoading } = useUser();
  const router = useRouter();

  // Redirect to login if not authenticated.
  useEffect(() => {
    if (!authLoading && !authUser) {
      router.push("/api/auth/login");
    }
  }, [authUser, authLoading, router]);

  // Fetch profile, projects, and available skills data when the user is available.
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
            interests {
              interest {
                id
                name
              }
            }
            email
            username
            profile_picture
            role
            bio
            website
            location
            skills {
              skill {
                id
                name
              }
            }
            organizations {
              id
              name
              logo
            }
            githubUsername
            githubAvatar  
          }
          myProjects {
            id
            title
            description
          }
          allSkills {
            id
            name
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
      setAvailableSkills(data.allSkills);
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
      {/* When the edit button is clicked in ProfileHeader, isEditing becomes true */}
      <ProfileHeader user={userData} onEdit={() => setIsEditing(true)} />
      {isEditing ? (
        <EditProfileForm
          initialData={userData}
          availableSkills={availableSkills}
          onProfileUpdated={(updatedProfile) => {
            setUserData(updatedProfile);
            setIsEditing(false);
          }}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <ProfileContent user={userData} projects={projects} />
      )}
    </div>
  );
}

