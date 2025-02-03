// "use client";
// import { useState, useEffect } from "react";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
// import { Label } from "@/components/ui/label";

// import { MoreHorizontal, PlusCircle, Search, Loader2 } from "lucide-react";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import { useRouter, useParams } from "next/navigation";
// import Layout from "@/components/Dashboard/Layout";

// export default function TeamManagement() {
//   const router = useRouter();
//   const params = useParams();
//   const { user, isLoading: userLoading } = useUser();

//   const [project, setProject] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState("");

//   // ------ NEW: Invite dialog states ------
//   const [inviteOpen, setInviteOpen] = useState(false);
//   const [inviteEmail, setInviteEmail] = useState("");
//   const [inviteRole, setInviteRole] = useState("MEMBER");
//   const [inviteLoading, setInviteLoading] = useState(false);
//   const [inviteError, setInviteError] = useState("");

//   // Redirect if user not logged in
//   useEffect(() => {
//     if (!userLoading && !user) {
//       router.push("/api/auth/login");
//     }
//   }, [user, userLoading, router]);

//   // Fetch the project/team details via GraphQL
//   useEffect(() => {
//     if (!userLoading && user && params.projectId) {
//       fetchProjectDetails(params.projectId);
//     }
//   }, [user, userLoading, params.projectId]);

//   async function fetchProjectDetails(id) {
//     try {
//       setLoading(true);

//       // GraphQL query
//       const query = `
//         query MyProject($projectId: String!) {
//           myProject(projectId: $projectId) {
//             id
//             title
//             members {
//               id
//               role
//               user {
//                 id
//                 name
//                 email
//               }
//             }
//           }
//         }
//       `;

//       // POST the query to your /api/graphql route
//       const response = await fetch("/api/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include", // include session cookies if needed
//         body: JSON.stringify({
//           query,
//           variables: { projectId: id },
//         }),
//       });

//       const { data, errors } = await response.json();

//       if (errors && errors.length > 0) {
//         throw new Error(errors[0].message);
//       }

//       // If successful, set the project in state
//       if (data?.myProject) {
//         setProject(data.myProject);
//       } else {
//         // If no project found, redirect
//         router.push("/dashboard");
//       }
//     } catch (error) {
//       console.error("Error fetching team:", error);
//       router.push("/dashboard");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // ------ NEW: Invite Member Handling ------
//   async function handleInviteSubmit(e) {
//     e.preventDefault();
//     setInviteError("");
//     setInviteLoading(true);

//     try {
//       const mutation = `
//         mutation InviteMember($projectId: String!, $email: String!, $role: String!) {
//           inviteMemberToProject(projectId: $projectId, email: $email, role: $role) {
//             id
//             role
//             user {
//               id
//               name
//               email
//             }
//           }
//         }
//       `;

//       const res = await fetch("/api/graphql", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({
//           query: mutation,
//           variables: {
//             projectId: params.projectId,
//             email: inviteEmail.trim(),
//             role: inviteRole,
//           },
//         }),
//       });

//       const { data, errors } = await res.json();
//       if (errors && errors.length > 0) {
//         throw new Error(errors[0].message);
//       }

//       // If successful, we get new member data. Let's refetch the entire team:
//       await fetchProjectDetails(params.projectId);

//       // Reset & close modal
//       setInviteEmail("");
//       setInviteRole("MEMBER");
//       setInviteOpen(false);
//     } catch (err) {
//       setInviteError(err.message);
//     } finally {
//       setInviteLoading(false);
//     }
//   }

//   const filteredMembers = () => {
//     if (!project?.members) return [];
//     return project.members.filter(
//       (member) =>
//         member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         member.user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         member.role.toLowerCase().includes(searchQuery.toLowerCase())
//     );
//   };

//   if (userLoading || loading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center h-full">
//           <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
//         </div>
//       </Layout>
//     );
//   }

//   return (
//     <Layout>
//       <div className="p-6 space-y-6">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <div>
//             <h1 className="text-2xl font-bold">Team Management</h1>
//             <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
//               Manage team members for {project?.title}
//             </p>
//           </div>
//           {/* Instead of router.push("/invite"), open a modal */}
//           <Button onClick={() => setInviteOpen(true)}>
//             <PlusCircle className="mr-2 h-4 w-4" />
//             Invite Member
//           </Button>
//         </div>

//         {/* Search Bar */}
//         <div className="relative max-w-md">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//           <Input
//             placeholder="Search members..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="pl-10"
//           />
//         </div>

//         {/* Team Table */}
//         <div className="rounded-lg border dark:border-gray-800">
//           <Table>
//             <TableHeader className="bg-gray-50 dark:bg-gray-800">
//               <TableRow>
//                 <TableHead className="w-[200px]">Name</TableHead>
//                 <TableHead>Email</TableHead>
//                 <TableHead>Role</TableHead>
//                 <TableHead className="text-right">Actions</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {filteredMembers().map((member) => (
//                 <TableRow
//                   key={member.id}
//                   className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
//                 >
//                   <TableCell className="font-medium">
//                     <div className="flex items-center gap-3">
//                       <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
//                         <span className="text-sm">
//                           {member.user.name ? member.user.name[0].toUpperCase() : "?"}
//                         </span>
//                       </div>
//                       {member.user.name}
//                     </div>
//                   </TableCell>
//                   <TableCell>{member.user.email}</TableCell>
//                   <TableCell>
//                     <span className="px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs">
//                       {member.role}
//                     </span>
//                   </TableCell>
//                   <TableCell className="text-right">
//                     <DropdownMenu>
//                       <DropdownMenuTrigger asChild>
//                         <Button variant="ghost" size="icon">
//                           <MoreHorizontal className="h-4 w-4" />
//                         </Button>
//                       </DropdownMenuTrigger>
//                       <DropdownMenuContent align="end">
//                         <DropdownMenuItem>Edit Role</DropdownMenuItem>
//                         <DropdownMenuItem className="text-red-600">
//                           Remove
//                         </DropdownMenuItem>
//                       </DropdownMenuContent>
//                     </DropdownMenu>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>

//           {filteredMembers().length === 0 && (
//             <div className="p-6 text-center text-gray-500 dark:text-gray-400">
//               No team members found
//             </div>
//           )}
//         </div>
//       </div>

//       {/* Invite Dialog */}
//       <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
//         <DialogContent>
//           <DialogHeader>
//             <DialogTitle>Invite New Member</DialogTitle>
//           </DialogHeader>
//           <form onSubmit={handleInviteSubmit} className="space-y-4">
//             {inviteError && (
//               <p className="text-red-600 text-sm">{inviteError}</p>
//             )}

//             <div>
//               <Label htmlFor="inviteEmail">Email</Label>
//               <Input
//                 id="inviteEmail"
//                 type="email"
//                 required
//                 value={inviteEmail}
//                 onChange={(e) => setInviteEmail(e.target.value)}
//               />
//             </div>
//             <div>
//               <Label htmlFor="inviteRole">Role</Label>
//               <Input
//                 id="inviteRole"
//                 type="text"
//                 value={inviteRole}
//                 onChange={(e) => setInviteRole(e.target.value)}
//                 // optionally use a <Select> if you have fixed roles (OWNER, ADMINISTRATOR, MEMBER, etc.)
//               />
//             </div>

//             <div className="flex justify-end gap-2 mt-4">
//               <Button
//                 variant="outline"
//                 type="button"
//                 onClick={() => setInviteOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={inviteLoading}>
//                 {inviteLoading ? (
//                   <Loader2 className="h-4 w-4 animate-spin" />
//                 ) : (
//                   "Invite"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </DialogContent>
//       </Dialog>
//     </Layout>
//   );
// }



















"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Layout from "@/components/Dashboard/Layout";

import { Loader2, PlusCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import TeamTable from "@/components/Dashboard/Teams/TeamTable"; // <--- import your separate component
import InviteMemberModal from "@/components/Dashboard/Teams/InviteMemberModal"; // <--- import the modal

export default function TeamManagement() {
  const router = useRouter();
  const params = useParams();
  const { user, isLoading: userLoading } = useUser();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [inviteError, setInviteError] = useState("");

  // 1. Check if user is logged in
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/api/auth/login");
    }
  }, [user, userLoading, router]);

  // 2. Load the project
  useEffect(() => {
    if (!userLoading && user && params.projectId) {
      fetchProjectDetails(params.projectId);
    }
  }, [user, userLoading, params.projectId]);

  async function fetchProjectDetails(id) {
    try {
      setLoading(true);

      const query = `
        query MyProject($projectId: String!) {
          myProject(projectId: $projectId) {
            id
            title
            members {
              id
              role
              status
              user {
                id
                name
                email
              }
            }
          }
        }
      `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ query, variables: { projectId: id } }),
      });

      const { data, errors } = await res.json();
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }
      if (!data?.myProject) {
        router.push("/dashboard"); // or handle not found
        return;
      }
      setProject(data.myProject);
    } catch (err) {
      console.error("Error fetching project:", err);
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  // 3. Invite member mutation
  async function handleInviteMember(email, role) {
    try {
      setInviteError("");
      setInviteLoading(true);

      const mutation = `
        mutation InviteMember($projectId: String!, $email: String!, $role: String!) {
          inviteMemberToProject(projectId: $projectId, email: $email, role: $role) {
            id
            role
            user {
              id
              name
              email
            }
          }
        }
      `;

      const res = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          query: mutation,
          variables: {
            projectId: params.projectId,
            email,
            role,
          },
        }),
      });

      const { data, errors } = await res.json();
      if (errors && errors.length > 0) {
        throw new Error(errors[0].message);
      }

      // Refetch members
      await fetchProjectDetails(params.projectId);

      // Close modal
      setInviteOpen(false);
    } catch (err) {
      setInviteError(err.message);
    } finally {
      setInviteLoading(false);
    }
  }

  // Filter members
  const filteredMembers = () => {
    if (!project?.members) return [];
    return project.members.filter(
      (m) =>
        m.user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  // Show a spinner while loading
  if (userLoading || loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
        </div>
      </Layout>
    );
  }

  // 4. Render
  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Team Management</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Manage team members for {project?.title}
            </p>
          </div>
          <Button onClick={() => setInviteOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Invite Member
          </Button>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Table of members */}
        <TeamTable members={filteredMembers()} />
      </div>

      {/* The modal */}
      <InviteMemberModal
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        loading={inviteLoading}
        error={inviteError}
        onInvite={handleInviteMember}
        defaultRole="MEMBER"
      />
    </Layout>
  );
}
