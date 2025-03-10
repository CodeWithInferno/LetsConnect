// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { useUser } from "@auth0/nextjs-auth0/client";
// import Layout from "@/components/Dashboard/Layout";
// import { Loader2, Users, Image, Pencil, Check, X } from "lucide-react";

// // EditableField component with pencil icon, Check (save) and X (cancel) buttons.
// export function EditableField({ label, value, onSave }) {
//   const [isEditing, setIsEditing] = useState(false);
//   const [inputValue, setInputValue] = useState(value);

//   const handleSave = () => {
//     setIsEditing(false);
//     onSave(inputValue);
//   };

//   return (
//     <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
//       <div>
//         <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>

//         {isEditing ? (
//           <input
//             type="text"
//             value={inputValue}
//             onChange={(e) => setInputValue(e.target.value)}
//             className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md 
//                        focus:outline-none focus:ring-2 focus:ring-blue-500 
//                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
//           />
//         ) : (
//           // Add double-click to switch to editing
//           <p
//             onDoubleClick={() => setIsEditing(true)}
//             className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer"
//           >
//             {value}
//           </p>
//         )}
//       </div>

//       {isEditing ? (
//         <div className="flex items-center gap-2">
//           <button onClick={handleSave} className="text-green-600">
//             <Check className="w-5 h-5" />
//           </button>
//           <button onClick={() => setIsEditing(false)} className="text-red-600">
//             <X className="w-5 h-5" />
//           </button>
//         </div>
//       ) : (
//         // Pencil icon to trigger editing
//         <button
//           onClick={() => setIsEditing(true)}
//           className="text-gray-500 hover:text-gray-800"
//         >
//           <Pencil className="w-5 h-5" />
//         </button>
//       )}
//     </div>
//   );
// }

// // ProjectSettingsPage.jsx

// export default function ProjectSettingsPage() {
//   const { projectId } = useParams();
//   const { user, error: userError, isLoading: userLoading } = useUser();

//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [project, setProject] = useState(null);

//   useEffect(() => {
//     async function fetchProjectDetails() {
//       setLoading(true);
//       setError(null);
//       try {
//         const query = `
//           query MyProject($projectId: String!) {
//             myProject(projectId: $projectId) {
//               id
//               title
//               description
//               budget
//               bannerImage
//               owner {
//                 id
//                 name
//                 email
//                 profile_picture
//               }
//               members {
//                 id
//                 role
//                 user {
//                   id
//                   name
//                   email
//                   profile_picture
//                 }
//               }
//             }
//           }
//         `;
//         const response = await fetch("/api/graphql", {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           credentials: "include",
//           body: JSON.stringify({ query, variables: { projectId } }),
//         });

//         const { data, errors } = await response.json();
//         if (errors) throw new Error(errors[0].message);
//         if (!data?.myProject) throw new Error("Project not found");

//         setProject({
//           ...data.myProject,
//           budget: data.myProject.budget?.toString() || "0",
//           bannerImage: data.myProject.bannerImage || "",
//           owner: data.myProject.owner,
//           members: data.myProject.members.map((m) => ({
//             id: m.id,
//             role: m.role,
//             name: m.user.name,
//             email: m.user.email,
//             profile_picture: m.user.profile_picture,
//           })),
//         });
//       } catch (err) {
//         console.error("Failed to fetch project details:", err);
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     }
//     if (projectId) fetchProjectDetails();
//   }, [projectId]);

//   if (loading || userLoading) {
//     return (
//       <Layout>
//         <div className="flex justify-center items-center h-full">
//           <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
//         </div>
//       </Layout>
//     );
//   }

//   if (error || userError) {
//     return (
//       <Layout>
//         <div className="text-center py-10">
//           <p className="text-red-500">{error || userError.message}</p>
//         </div>
//       </Layout>
//     );
//   }

//   if (!project) {
//     return (
//       <Layout>
//         <div className="text-center py-10">
//           <p className="text-gray-500 dark:text-white">Project not found.</p>
//         </div>
//       </Layout>
//     );
//   }

//   // Helper to update local project state
//   function handleFieldUpdate(field, newValue) {
//     setProject((prev) => ({ ...prev, [field]: newValue }));
//   }

//   return (
//     <Layout>
//       <div className="max-w-6xl mx-auto p-8 space-y-8">
//         {/* Banner Image */}
//         {project.bannerImage ? (
//           <div
//             className="relative w-full h-52 bg-cover bg-center rounded-lg shadow-md"
//             style={{ backgroundImage: `url(${project.bannerImage})` }}
//           >
//             <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
//               <h1 className="text-4xl font-bold text-white dark:text-white">
//                 {project.title}
//               </h1>
//             </div>
//           </div>
//         ) : (
//           <div className="relative w-full h-52 bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg shadow-md">
//             <Image className="w-12 h-12 text-gray-400 dark:text-white" />
//             <h1 className="absolute text-3xl font-bold text-gray-500 dark:text-white">
//               {project.title}
//             </h1>
//           </div>
//         )}

//         {/* Project Info Section */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {/* Left Column */}
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-6">
//             <h2 className="text-xl font-semibold border-b pb-2 text-gray-900 dark:text-white">
//               Project Information
//             </h2>

//             <EditableField
//               label="Project Title"
//               value={project.title}
//               onSave={(newValue) => handleFieldUpdate("title", newValue)}
//             />

//             <EditableField
//               label="Description"
//               value={project.description}
//               onSave={(newValue) => handleFieldUpdate("description", newValue)}
//             />

//             <EditableField
//               label="Budget"
//               value={`$${project.budget}`}
//               onSave={(newValue) =>
//                 handleFieldUpdate("budget", newValue.replace("$", ""))
//               }
//             />
//           </div>

//           {/* Right Column - Owner Info */}
//           <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-6">
//             <h2 className="text-xl font-semibold border-b pb-2 text-gray-900 dark:text-white">
//               Project Owner
//             </h2>
//             <div className="flex items-center gap-4">
//               <img
//                 src={project.owner.profile_picture || "/default-avatar.png"}
//                 alt="Owner"
//                 className="w-16 h-16 rounded-full border"
//               />
//               <EditableField
//                 label="Owner Name"
//                 value={project.owner.name}
//                 onSave={(newValue) =>
//                   setProject((prev) => ({
//                     ...prev,
//                     owner: { ...prev.owner, name: newValue },
//                   }))
//                 }
//               />
//             </div>
//           </div>
//         </div>

//         {/* Team Members Section */}
//         <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-4">
//           <h2 className="text-xl font-semibold border-b pb-2 flex items-center gap-2 text-gray-900 dark:text-white">
//             <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
//             Team Members
//           </h2>

//           <div className="space-y-4">
//             {project.members.map((member) => (
//               <div
//                 key={member.id}
//                 className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
//               >
//                 <img
//                   src={member.profile_picture || "/default-avatar.png"}
//                   alt={member.name}
//                   className="w-12 h-12 rounded-full border"
//                 />
//                 <div className="flex-1">
//                   <p className="font-medium text-gray-900 dark:text-white">
//                     {member.name}
//                   </p>
//                   <p className="text-sm text-gray-500 dark:text-gray-300">
//                     {member.email}
//                   </p>
//                 </div>
//                 <div className="w-32">
//                   <EditableField
//                     label="Role"
//                     value={member.role}
//                     onSave={(newRole) =>
//                       setProject((prev) => ({
//                         ...prev,
//                         members: prev.members.map((m) =>
//                           m.id === member.id ? { ...m, role: newRole } : m
//                         ),
//                       }))
//                     }
//                   />
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }



























"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useUser } from "@auth0/nextjs-auth0/client";
import Layout from "@/components/Dashboard/Layout";
import { Loader2, Users, Image, Pencil, Check, X } from "lucide-react";

export function EditableField({ label, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  const handleSave = () => {
    setIsEditing(false);
    onSave(inputValue);
  };

  return (
    <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 pb-2">
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {isEditing ? (
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-700 rounded-md 
                       focus:outline-none focus:ring-2 focus:ring-blue-500 
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          />
        ) : (
          <p
            onDoubleClick={() => setIsEditing(true)}
            className="text-lg font-semibold text-gray-900 dark:text-white cursor-pointer"
          >
            {value}
          </p>
        )}
      </div>

      {isEditing ? (
        <div className="flex items-center gap-2">
          <button onClick={handleSave} className="text-green-600">
            <Check className="w-5 h-5" />
          </button>
          <button onClick={() => setIsEditing(false)} className="text-red-600">
            <X className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsEditing(true)}
          className="text-gray-500 hover:text-gray-800"
        >
          <Pencil className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}

export default function ProjectSettingsPage() {
  const { projectId } = useParams();
  const { user, error: userError, isLoading: userLoading } = useUser();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [project, setProject] = useState(null);

  useEffect(() => {
    async function fetchProjectDetails() {
      setLoading(true);
      setError(null);
      try {
        const query = `
          query MyProject($projectId: String!) {
            myProject(projectId: $projectId) {
              id
              title
              description
              budget
              bannerImage
              owner {
                id
                name
                email
                profile_picture
              }
              members {
                id
                role
                user {
                  id
                  name
                  email
                  profile_picture
                }
              }
            }
          }
        `;
        const response = await fetch("/api/graphql", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ query, variables: { projectId } }),
        });

        const { data, errors } = await response.json();
        if (errors) throw new Error(errors[0].message);
        if (!data?.myProject) throw new Error("Project not found");

        setProject({
          ...data.myProject,
          budget: data.myProject.budget?.toString() || "0",
          bannerImage: data.myProject.bannerImage || "",
          owner: data.myProject.owner,
          members: data.myProject.members.map((m) => ({
            id: m.id,
            role: m.role,
            name: m.user.name,
            email: m.user.email,
            profile_picture: m.user.profile_picture,
          })),
        });
      } catch (err) {
        console.error("Failed to fetch project details:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (projectId) fetchProjectDetails();
  }, [projectId]);

  if (loading || userLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
        </div>
      </Layout>
    );
  }

  if (error || userError) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-red-500">{error || userError.message}</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-white">Project not found.</p>
        </div>
      </Layout>
    );
  }

  // Authorization check: allow access only if the current user is the Owner or an Administrator.
// Authorization check: allow access if the current user is the Owner or an Administrator.
const isOwner =
  user && (user.sub === project.owner.id || user.email === project.owner.email);
const isAdmin = project.members.some(
  (member) => member.id === user.sub && member.role === "Administrator"
);

if (!(isOwner || isAdmin)) {
  return (
    <Layout>
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-white">
          You cannot access this page.
        </p>
      </div>
    </Layout>
  );
}


  // Helper to update local project state
  function handleFieldUpdate(field, newValue) {
    setProject((prev) => ({ ...prev, [field]: newValue }));
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Banner Image */}
        {project.bannerImage ? (
          <div
            className="relative w-full h-52 bg-cover bg-center rounded-lg shadow-md"
            style={{ backgroundImage: `url(${project.bannerImage})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center">
              <h1 className="text-4xl font-bold text-white dark:text-white">
                {project.title}
              </h1>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-52 bg-gray-200 dark:bg-gray-800 flex items-center justify-center rounded-lg shadow-md">
            <Image className="w-12 h-12 text-gray-400 dark:text-white" />
            <h1 className="absolute text-3xl font-bold text-gray-500 dark:text-white">
              {project.title}
            </h1>
          </div>
        )}

        {/* Project Info Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-900 dark:text-white">
              Project Information
            </h2>

            <EditableField
              label="Project Title"
              value={project.title}
              onSave={(newValue) => handleFieldUpdate("title", newValue)}
            />

            <EditableField
              label="Description"
              value={project.description}
              onSave={(newValue) => handleFieldUpdate("description", newValue)}
            />

            <EditableField
              label="Budget"
              value={`$${project.budget}`}
              onSave={(newValue) =>
                handleFieldUpdate("budget", newValue.replace("$", ""))
              }
            />
          </div>

          {/* Right Column - Owner Info */}
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-6">
            <h2 className="text-xl font-semibold border-b pb-2 text-gray-900 dark:text-white">
              Project Owner
            </h2>
            <div className="flex items-center gap-4">
              <img
                src={project.owner.profile_picture || "/default-avatar.png"}
                alt="Owner"
                className="w-16 h-16 rounded-full border"
              />
              <EditableField
                label="Owner Name"
                value={project.owner.name}
                onSave={(newValue) =>
                  setProject((prev) => ({
                    ...prev,
                    owner: { ...prev.owner, name: newValue },
                  }))
                }
              />
            </div>
          </div>
        </div>

        {/* Team Members Section */}
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-md space-y-4">
          <h2 className="text-xl font-semibold border-b pb-2 flex items-center gap-2 text-gray-900 dark:text-white">
            <Users className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            Team Members
          </h2>

          <div className="space-y-4">
            {project.members.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg"
              >
                <img
                  src={member.profile_picture || "/default-avatar.png"}
                  alt={member.name}
                  className="w-12 h-12 rounded-full border"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {member.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-300">
                    {member.email}
                  </p>
                </div>
                <div className="w-32">
                  <EditableField
                    label="Role"
                    value={member.role}
                    onSave={(newRole) =>
                      setProject((prev) => ({
                        ...prev,
                        members: prev.members.map((m) =>
                          m.id === member.id ? { ...m, role: newRole } : m
                        ),
                      }))
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
