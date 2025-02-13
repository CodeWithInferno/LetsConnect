"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { format } from "date-fns"
import { Github, Mail, Calendar, Award, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Utility to safely format date strings
const safeFormat = (dateStr, dateFormat) => {
  if (!dateStr) return "N/A"
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return "N/A"
  return format(d, dateFormat)
}

export default function ProjectPage() {
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { slug } = useParams()

  useEffect(() => {
    async function fetchProject() {
      setLoading(true)
      try {
        const query = `
          query ProjectBySlug($slug: String!) {
            projectBySlug(slug: $slug) {
              id
              title
              description
              projectType
              deadline
              bannerImage
              githubRepo
              email
              createdAt
              updatedAt
              certificateEligible
              owner {
                id
                username
                name
                profile_picture
                githubAvatar
              }
              organization {
                id
                name
                logo
              }
              members {
                id
                role
                joinedAt
                user {
                  id
                  username
                  name
                  profile_picture
                  githubAvatar
                }
              }
              skillsRequired {
                id
                name
                isCustom
              }
              languages {
                id
                name
              }
            }
          }
        `

        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query, variables: { slug } }),
        })

        const result = await response.json()
        if (result.errors && result.errors.length > 0) {
          throw new Error(result.errors[0].message)
        }
        setProject(result.data.projectBySlug)
      } catch (err) {
        console.error("Error fetching project:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  if (loading) return <ProjectSkeleton />
  if (error) return <ErrorDisplay error={error} />
  if (!project) return <div className="text-center py-10">No project found</div>

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{project.title}</CardTitle>
          <CardDescription>{project.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {project.bannerImage && (
            <img
              src={project.bannerImage || "/placeholder.svg"}
              alt="Project Banner"
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <InfoItem
              icon={<Calendar className="mr-2" />}
              label="Deadline"
              value={safeFormat(project.deadline, "PPP")}
            />
            <InfoItem
              icon={<Mail className="mr-2" />}
              label="Email"
              value={project.email}
            />
            {project.githubRepo && (
              <InfoItem
                icon={<Github className="mr-2" />}
                label="GitHub Repo"
                value={
                  <a
                    href={project.githubRepo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    {project.githubRepo}
                  </a>
                }
              />
            )}
            <InfoItem
              icon={<Award className="mr-2" />}
              label="Certificate Eligible"
              value={project.certificateEligible ? "Yes" : "No"}
            />
          </div>
          <Badge variant={project.projectType === "OPEN_SOURCE" ? "secondary" : "default"}>
            {project.projectType}
          </Badge>
          {/* Display Skills and Programming Languages */}
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div>
              <h3 className="font-semibold mb-1">Skills</h3>
              {project.skillsRequired && project.skillsRequired.length > 0 ? (
                <ul className="list-disc ml-4">
                  {project.skillsRequired.map((skill) => (
                    <li key={skill.id}>{skill.name}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
            <div>
              <h3 className="font-semibold mb-1">Programming Languages</h3>
              {project.languages && project.languages.length > 0 ? (
                <ul className="list-disc ml-4">
                  {project.languages.map((lang) => (
                    <li key={lang.id}>{lang.name}</li>
                  ))}
                </ul>
              ) : (
                <p>N/A</p>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="text-sm text-muted-foreground">
          <div>Created: {safeFormat(project.createdAt, "PP")}</div>
          <div className="ml-4">Updated: {safeFormat(project.updatedAt, "PP")}</div>
        </CardFooter>
      </Card>

      <Tabs defaultValue="team" className="mb-8">
        <TabsList>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="organization">Organization</TabsTrigger>
        </TabsList>
        <TabsContent value="team">
          <Card>
            <CardHeader>
              <CardTitle>Project Team</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <OwnerDisplay owner={project.owner} />
                <MembersDisplay members={project.members} />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="organization">
          <Card>
            <CardHeader>
              <CardTitle>Organization</CardTitle>
            </CardHeader>
            <CardContent>
              {project.organization ? (
                <div className="flex items-center space-x-4">
                  {project.organization.logo && (
                    <img
                      src={project.organization.logo || "/placeholder.svg"}
                      alt="Organization Logo"
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{project.organization.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Organization ID: {project.organization.id}
                    </p>
                  </div>
                </div>
              ) : (
                <p>No organization associated with this project.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center space-x-4">
        <Button>Join Project</Button>
        <Button variant="outline">Contact Owner</Button>
      </div>
    </div>
  )
}

function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-center">
      {icon}
      <span className="font-semibold mr-2">{label}:</span>
      <span>{value}</span>
    </div>
  )
}

function OwnerDisplay({ owner }) {
  const avatarSrc = owner.profile_picture || owner.githubAvatar || "/placeholder.svg"
  return (
    <div className="flex items-center space-x-4">
      <Avatar>
        <img src={avatarSrc} alt="Owner Avatar" className="w-10 h-10 rounded-full" />
        <AvatarFallback>{owner.name ? owner.name[0] : owner.username[0]}</AvatarFallback>
      </Avatar>
      <div>
        <h3 className="text-lg font-semibold">{owner.name}</h3>
        <p className="text-sm text-muted-foreground">
          Project Owner - @{owner.username}
        </p>
      </div>
    </div>
  )
}

function MembersDisplay({ members }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-2 flex items-center">
        <Users className="mr-2" />
        Team Members
      </h3>
      {members && members.length > 0 ? (
        <ul className="space-y-2">
          {members.map((member) => {
            const user = member.user
            const avatarSrc = user.profile_picture || user.githubAvatar || "/placeholder.svg"
            return (
              <li key={member.id} className="flex items-center space-x-2">
                <Avatar>
                  <img src={avatarSrc} alt="Member Avatar" className="w-8 h-8 rounded-full" />
                  <AvatarFallback>{user.name ? user.name[0] : user.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{user.name || user.username}</p>
                  <p className="text-sm text-muted-foreground">
                    {member.role} - Joined {safeFormat(member.joinedAt, "PP")}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      ) : (
        <p>No team members yet</p>
      )}
    </div>
  )
}

function ProjectSkeleton() {
  return (
    <div className="container mx-auto py-8 space-y-8">
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-full mt-2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full mb-4" />
          <div className="grid grid-cols-2 gap-4 mb-4">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
          <Skeleton className="h-6 w-24" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-1/3" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorDisplay({ error }) {
  return (
    <div className="container mx-auto py-10 text-center">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p>{error}</p>
      <Button className="mt-4" onClick={() => window.location.reload()}>
        Try Again
      </Button>
    </div>
  )
}
