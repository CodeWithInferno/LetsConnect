// "use client";

// import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";

// export default function ProfileLayout({ data }) {
//   return (
//     <div className="min-h-screen">
//       {/* Navbar */}
//       <nav className="border-b">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               {/* Your Navbar content here */}
//             </div>
//           </div>
//         </div>
//       </nav>

//       {/* Profile Content */}
//       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex gap-8 items-start">
//           {/* Avatar Container */}
//           <div className="relative">
//             <div className="h-36 w-36 rounded-full border-4 border-foreground/10 p-1">
//               <Avatar className="h-32 w-32">
//                 <AvatarImage 
//                   src={data.profile_picture} 
//                   alt={`${data.name}'s profile picture`}
//                 />
//                 <AvatarFallback className="text-3xl">
//                   {data.name?.charAt(0) || data.username?.charAt(0)}
//                 </AvatarFallback>
//               </Avatar>
//             </div>
//           </div>

//           {/* Profile Details */}
//           <div className="flex-1 space-y-4">
//             {/* Name and Username */}
//             <div className="space-y-2">
//               <h1 className="text-3xl font-bold">{data.name}</h1>
//               <p className="text-muted-foreground text-xl">@{data.username}</p>
//             </div>

//             {/* Stats and Bio */}
//             <div className="space-y-4">
//               {/* Stats Row */}
//               <div className="flex gap-6">
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">1.2k</span>
//                   <span className="text-muted-foreground">followers</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">548</span>
//                   <span className="text-muted-foreground">following</span>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <span className="font-semibold">24</span>
//                   <span className="text-muted-foreground">projects</span>
//                 </div>
//               </div>

//               {/* Bio */}
//               <p className="text-muted-foreground max-w-2xl">
//                 {data.bio || "No bio provided"}
//               </p>
//             </div>

//             {/* Details Grid */}
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-1">
//                 <p className="text-sm text-muted-foreground">Location</p>
//                 <p>{data.location || "Not specified"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm text-muted-foreground">Email</p>
//                 <p>{data.email || "Not specified"}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm text-muted-foreground">Joined</p>
//                 <p>{data.joinedAt}</p>
//               </div>
//               <div className="space-y-1">
//                 <p className="text-sm text-muted-foreground">Timezone</p>
//                 <p>{data.timezone || "Not specified"}</p>
//               </div>
//             </div>

//             {/* Skills */}
//             <div className="space-y-2">
//               <h3 className="font-semibold text-lg">Skills</h3>
//               <div className="flex flex-wrap gap-2">
//                 {data.skills?.map((skill) => (
//                   <span
//                     key={skill}
//                     className="px-3 py-1 rounded-full bg-muted text-sm"
//                   >
//                     {skill}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }










// components/profile/ProfileLayout.js
"use client";
import dynamic from 'next/dynamic';
import { useState } from "react";

const Navbar = dynamic(
  () => import('@/components/Navbar'),
  { ssr: false }
);

const AvatarSection = dynamic(
  () => import('@/components/profile/AvatarSection'),
  { ssr: false }
);

export default function ProfileLayout({ data }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Rest of your layout */}
    </div>
  );
}