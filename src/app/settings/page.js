// // app/settings/page.jsx
// 'use client';

// import React, { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import { Loader2, Edit } from "lucide-react";
// import { Card, CardHeader, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// export default function SettingsPage() {
//   const [userData, setUserData] = useState(null);
//   const [projects, setProjects] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const { user: authUser, isLoading: authLoading } = useUser();
//   const router = useRouter();

//   // Redirect to login if not logged in
//   useEffect(() => {
//     if (!authLoading && !authUser) {
//       router.push("/api/auth/login");
//     }
//   }, [authUser, authLoading, router]);

//   // Fetch data once the Auth0 user is available
//   useEffect(() => {
//     if (!authLoading && authUser?.email) {
//       fetchData();
//     }
//   }, [authUser, authLoading]);

//   async function fetchData() {
//     setLoading(true);
//     try {
//       const query = `
//         query {
//           myProfile {
//             id
//             name
//             email
//             username
//             profile_picture
//             role
//             bio
//             website
//             location
//             organizations {
//               id
//               name
//               logo
//             }
//             skills {
//               skill {
//                 id
//                 name
//               }
//             }
//           }
//           myProjects {
//             id
//             title
//             description
//           }
//         }
//       `;

//       const response = await fetch("/api/graphql", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         credentials: "include",
//         body: JSON.stringify({ query }),
//       });

//       const { data, errors } = await response.json();
//       if (errors && errors.length > 0) {
//         throw new Error(errors[0].message);
//       }
//       setUserData(data.myProfile);
//       setProjects(data.myProjects);
//     } catch (err) {
//       console.error("Error fetching data:", err);
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   }

//   if (authLoading || loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="p-8 text-red-500">Error: {error}</div>;
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6 space-y-8">
//       {/* Header with user avatar and basic info */}
//       <Card className="p-6">
//         <div className="flex items-center gap-4">
//           <Avatar className="w-16 h-16">
//             {userData?.profile_picture ? (
//               <AvatarImage src={userData.profile_picture} alt={userData.name} />
//             ) : (
//               <AvatarFallback>{userData?.name?.[0] || "U"}</AvatarFallback>
//             )}
//           </Avatar>
//           <div>
//             <h1 className="text-2xl font-bold">{userData?.name || "No Name"}</h1>
//             <p className="text-sm text-gray-500">@{userData?.username}</p>
//             <p className="text-sm text-gray-500">{userData?.email}</p>
//           </div>
//           <Button variant="outline" className="ml-auto">
//             <Edit className="mr-2 h-4 w-4" /> Edit Profile
//           </Button>
//         </div>
//       </Card>

//       {/* Profile Details Section */}
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Profile Details</h2>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div>
//             <span className="font-medium">Bio: </span>
//             <span>{userData?.bio || "No bio set."}</span>
//           </div>
//           <div>
//             <span className="font-medium">Website: </span>
//             <span>{userData?.website || "Not provided"}</span>
//           </div>
//           <div>
//             <span className="font-medium">Location: </span>
//             <span>{userData?.location || "Not provided"}</span>
//           </div>
//           <div>
//             <span className="font-medium">Role: </span>
//             <span>{userData?.role || "N/A"}</span>
//           </div>
//           <div>
//             <span className="font-medium">Skills: </span>
//             <div className="flex flex-wrap gap-2 mt-1">
//               {userData?.skills?.map(({ skill }) => (
//                 <span
//                   key={skill.id}
//                   className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
//                 >
//                   {skill.name}
//                 </span>
//               ))}
//               {(!userData?.skills || userData.skills.length === 0) && (
//                 <span className="text-gray-500">No skills added yet</span>
//               )}
//             </div>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Organizations Section */}
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Organizations</h2>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {userData?.organizations && userData.organizations.length > 0 ? (
//             userData.organizations.map((org) => (
//               <div key={org.id} className="flex items-center gap-4">
//                 <Avatar className="w-10 h-10">
//                   {org.logo ? (
//                     <AvatarImage src={org.logo} alt={org.name} />
//                   ) : (
//                     <AvatarFallback>{org.name[0]}</AvatarFallback>
//                   )}
//                 </Avatar>
//                 <span className="font-medium">{org.name}</span>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">
//               You are not a member of any organization.
//             </p>
//           )}
//         </CardContent>
//       </Card>

//       {/* Projects Section */}
//       <Card>
//         <CardHeader>
//           <h2 className="text-xl font-semibold">Your Projects</h2>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           {projects && projects.length > 0 ? (
//             projects.map((proj) => (
//               <div key={proj.id} className="p-4 border rounded-md hover:shadow-md">
//                 <h3 className="font-bold">{proj.title}</h3>
//                 <p className="text-gray-600 text-sm">
//                   {proj.description || "No description provided."}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No projects found.</p>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }

// app/settings/page.jsx
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
