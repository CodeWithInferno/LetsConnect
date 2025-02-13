"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, LinkIcon, Users, Building, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    async function fetchProfile() {
      setLoading(true);
      try {
        const query = `
        query {
          myProfile {
            id
            name
            username
            email
            profile_picture
            role
            bio
            website
            location
            timezone
            qualifications
            githubUsername
            githubAvatar
            joinedAt
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
            interests {
              interest {
                id
                name
              }
            }
          }
          myProjects {
            id
            title
            description
            languages {
              id
              name
            }
          }
        }
      `;

        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query }),
        });

        const result = await response.json();
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message);
        }
        setProfile(result.data.myProfile);
        setProjects(result.data.myProjects);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, []);

  if (loading) return <ProfileSkeleton />;
  if (error) return <div className="p-4">Error: {error}</div>;
  if (!profile) return <div className="p-4">No profile found</div>;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
          {/* Left Column - Profile Info */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={
                  profile.profile_picture ||
                  profile.githubAvatar ||
                  "/placeholder.svg?height=296&width=296"
                }
                alt={profile.name}
                width={296}
                height={296}
                className="rounded-full border-4 border-background"
                priority
              />
              <div className="mt-4">
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-lg text-muted-foreground">
                  {profile.username}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                Edit profile
              </Button>

              <div className="space-y-2 text-sm">
                {profile.organizations?.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    <span>{profile.organizations[0].name}</span>
                  </div>
                )}

                {profile.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}

                {profile.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{profile.email}</span>
                  </div>
                )}

                {profile.website && (
                  <div className="flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    <Link
                      href={profile.website}
                      className="text-primary hover:underline"
                    >
                      {profile.website.replace(/^https?:\/\//, "")}
                    </Link>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <Link href="#" className="hover:text-primary">
                    <span className="font-semibold">2</span> followers
                  </Link>
                  <span>·</span>
                  <Link href="#" className="hover:text-primary">
                    <span className="font-semibold">5</span> following
                  </Link>
                </div>
              </div>
            </div>

            {/* Interests Section */}
            <Card className="p-4">
              <h2 className="mb-3 text-sm font-semibold">Interests</h2>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((i, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-secondary/50 px-3 py-1 text-xs"
                  >
                    {i.interest.name}
                  </span>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column - Additional Info */}
          <div className="space-y-6">
            {/* Additional Info Card */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Additional Info</h2>
              <p>
                <strong>Joined:</strong>{" "}
                {profile.joinedAt
                  ? new Date(profile.joinedAt).toLocaleDateString()
                  : "N/A"}
              </p>
              <p>
                <strong>Timezone:</strong> {profile.timezone || "N/A"}
              </p>
              {profile.rating && (
                <p>
                  <strong>Rating:</strong> {profile.rating}
                </p>
              )}
              {profile.githubUsername && (
                <p>
                  <strong>GitHub:</strong>{" "}
                  <a
                    href={`https://github.com/${profile.githubUsername}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {profile.githubUsername}
                  </a>
                </p>
              )}
            </Card>

            {profile.bio && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Bio</h2>
                <p className="text-muted-foreground">{profile.bio}</p>
              </Card>
            )}

            {profile.organizations?.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Organizations</h2>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                  {profile.organizations.map((org) => (
                    <div key={org.id} className="flex items-center gap-3">
                      {org.logo ? (
                        <Image
                          src={org.logo || "/placeholder.svg"}
                          alt={org.name}
                          width={40}
                          height={40}
                          className="rounded-lg"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-muted" />
                      )}
                      <span className="font-medium">{org.name}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Skills Section */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">Skills</h2>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((s, index) => (
                  <span
                    key={index}
                    className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary"
                  >
                    {s.skill.name}
                  </span>
                ))}
              </div>
            </Card>

            {/* Projects Grid Section */}
            <Card className="p-6">
              <h2 className="mb-4 text-xl font-semibold">My Projects</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="p-4">
                    <h3 className="font-bold text-lg">{project.title}</h3>
                    {project.languages && project.languages.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Languages:{" "}
                        {project.languages
                          .map((lang) => lang.name)
                          .join(", ")}
                      </p>
                    )}
                    {project.description && (
                      <p className="text-sm mt-2">
                        {project.description.substring(0, 100)}
                        {project.description.length > 100 ? "..." : ""}
                      </p>
                    )}
                  </Card>
                ))}
              </div>
            </Card>

            {profile.qualifications && (
              <Card className="p-6">
                <h2 className="mb-4 text-xl font-semibold">Qualifications</h2>
                <p className="text-muted-foreground">
                  {profile.qualifications}
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfileSkeleton() {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[300px_1fr]">
        <div className="space-y-4">
          <Skeleton className="h-[296px] w-[296px] rounded-full" />
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-20 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[180px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full rounded-lg" />
          <Skeleton className="h-[150px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  );
}
