"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Moon, Sun, Plus, ArrowRight, Loader2, Bell, Settings } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState("light");

  const { user, isLoading: userLoading } = useUser();
  const router = useRouter();

  // 1. Check if user is logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  // 2. Once user is known, check the profile completeness
  useEffect(() => {
    if (!userLoading && user) {
      checkProfileCompleteness();
    }
  }, [user, userLoading]);

  async function checkProfileCompleteness() {
    try {
      const res = await fetch("/api/user/check-profile");
      if (!res.ok) {
        console.error("Error calling check-profile:", await res.text());
        return;
      }
      const data = await res.json();
      if (data.onboardingNeeded) {
        router.push("/onboarding");
      } else {
        await fetchUserData();
        await fetchMyProjects();
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
    }
  }

  // 3. Fetch the user’s role & organizations
  async function fetchUserData() {
    setLoading(true);
    try {
      const query = `
        query {
          myUser {
            id
            role
            organizations {
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
      const { data, errors } = await response.json();
      if (errors?.length) {
        throw new Error(errors[0].message);
      }
      if (data?.myUser) {
        setUserRole(data.myUser.role);
        setOrgs(data.myUser.organizations || []);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  }

  // 4. Fetch the user’s projects
  async function fetchMyProjects() {
    try {
      setLoading(true);
      const query = `
        query {
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
      if (errors?.length) {
        throw new Error(errors[0].message);
      }
      if (data?.myProjects) {
        setProjects(data.myProjects);
      }
    } catch (error) {
      console.error("Error fetching myProjects:", error);
    } finally {
      setLoading(false);
    }
  }

  // 5. Handle overall loading
  if (userLoading || loading) {
    return (
      <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          </div>
        </div>
      </div>
    );
  }

  // 6. Toggle theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
    document.documentElement.classList.toggle("dark");
  };

  // 7. Determine roles/conditions
  const isManagerWithoutOrg = userRole === "Manager" && orgs.length === 0;
  const isContributor = userRole === "Contributor";

  return (
    <div className="min-h-screen p-8 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-6xl dark:bg-gray-900  mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Your Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={toggleTheme} className="rounded-full">
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/settings")}
              className="rounded-full"
            >
              <Settings className="h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/notifications")}
              className="rounded-full"
            >
              <Bell className="h-5 w-5" />
            </Button>
            {/* You can adjust the New Project button based on role */}
            {isManagerWithoutOrg ? (
              <Button onClick={() => router.push("/organization/create")}>
                <Plus className="h-4 w-4 mr-2" /> Create Organization
              </Button>
            ) : (
              <Button onClick={() => router.push("/projects/new")}>
                <Plus className="h-4 w-4 mr-2" /> New Project
              </Button>
            )}
          </div>
        </div>

        {/* Main Content */}
        {isManagerWithoutOrg ? (
          // Manager without an organization
          <Card className="border-dashed">
            <CardContent className="flex dark:bg-gray-900  flex-col items-center justify-center py-12 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                You need an organization to manage projects
              </p>
              <Button
                variant="link"
                onClick={() => router.push("/organization/create")}
                className="text-blue-600 dark:text-blue-400"
              >
                Create your organization <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : projects.length > 0 ? (
          // If there are projects, display the list (regardless of role)
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((proj) => (
              <Card key={proj.id} className="group hover:shadow-lg transition-all duration-200 dark:bg-gray-800">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <h3 className="font-semibold text-xl text-gray-900 dark:text-white">
                    {proj.title}
                  </h3>
                  <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">
                    Active
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-2">
                    {proj.description || "No description provided"}
                  </p>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() =>
                      router.push(
                        userRole === "Contributor"
                          ? `/dashboard/project/${proj.id}`
                          : `/dashboard/manage/${proj.id}`
                      )
                    }
                  >
                    <span>
                      {userRole === "Contributor" ? "View Project" : "Manage Project"}
                    </span>
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          // No projects available
          userRole === "Contributor" ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You are not part of any projects yet
                </p>
                <Button
                  variant="link"
                  onClick={() => router.push("/explore")}
                  className="text-blue-600 dark:text-blue-400"
                >
                  Browse Projects <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mb-4">
                  <Plus className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">No projects found</p>
                <Button
                  variant="link"
                  onClick={() => router.push("/projects/new")}
                  className="text-blue-600 dark:text-blue-400"
                >
                  Create your first project <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          )
        )}
      </div>
    </div>
  );
}
