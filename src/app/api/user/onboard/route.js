


// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";
// import { getSession } from "@auth0/nextjs-auth0";

// const prisma = new PrismaClient();

// // Feel free to expand or modify these
// const PREDEFINED_SKILLS = [
//   "React",
//   "Python",
//   "UI/UX",
//   "Blockchain",
//   "TypeScript",
//   "Machine Learning",
// ];

// export async function POST(req) {
//   try {
//     const session = await getSession(req);
    
//     // 1. Check if user is logged in
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     // 2. Parse request body
//     const {
//       username,
//       skills = [],
//       name,
//       number,
//       phone_extension,
//       profilePicture,
//       interests,
//       role,
//       timezone,
//       qualifications,
//     } = await req.json();

//     const email = session.user.email;

//     // 3. Check if there is an existing user with this email
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//       include: {
//         skills: true, // if you have a `skills` relation in your User model
//       },
//     });

//     // 4. If user does NOT exist => Create
//     if (!existingUser) {
//       // Check if the requested username is already taken by *any* user
//       const existingUsername = await prisma.user.findUnique({
//         where: { username },
//       });
//       if (existingUsername) {
//         return NextResponse.json(
//           { error: "Username already exists" },
//           { status: 400 }
//         );
//       }

//       // Create new user
//       const newUser = await prisma.user.create({
//         data: {
//           email,
//           name,
//           username,
//           number,
//           phone_extension,
//           profile_picture: profilePicture,
//           interests,
//           role,
//           timezone,
//           qualifications,
//           joined_at: new Date(),
//         },
//       });

//       // Process skills
//       await updateUserSkills(newUser.id, skills);

//       return NextResponse.json({ success: true, user: newUser }, { status: 201 });
//     }

//     // 5. If user ALREADY exists => Update
//     // Check if the username is changing
//     if (username !== existingUser.username) {
//       // See if that new username is taken by *another* user
//       const otherUserWithUsername = await prisma.user.findUnique({
//         where: { username },
//       });
//       if (otherUserWithUsername && otherUserWithUsername.id !== existingUser.id) {
//         return NextResponse.json(
//           { error: "Username already exists" },
//           { status: 400 }
//         );
//       }
//     }

//     // 6. Perform the update
//     const updatedUser = await prisma.user.update({
//       where: { id: existingUser.id },
//       data: {
//         name,
//         username,
//         number,
//         phone_extension,
//         profile_picture: profilePicture,
//         interests,
//         role,
//         timezone,
//         qualifications,
//       },
//     });

//     // 7. Update skills (by overwriting previous associations)
//     await updateUserSkills(updatedUser.id, skills);

//     // Return the updated user
//     return NextResponse.json({ success: true, user: updatedUser }, { status: 200 });

//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       { error: error.message || "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }

// /**
//  * Helper function to overwrite user’s skills.
//  *  - Deletes old userSkill entries.
//  *  - Creates new ones based on the incoming skill array.
//  */
// async function updateUserSkills(userId, skills) {
//   // 1. Remove old associations
//   await prisma.userSkill.deleteMany({
//     where: { userId },
//   });

//   // 2. For each skill, upsert and then link to user
//   for (const skillName of skills) {
//     const trimmedSkill = skillName.trim();
//     if (!trimmedSkill) continue;

//     // Upsert skill
//     const skill = await prisma.skill.upsert({
//       where: { name: trimmedSkill },
//       update: {},
//       create: {
//         name: trimmedSkill,
//         isCustom: !PREDEFINED_SKILLS.includes(trimmedSkill),
//       },
//     });

//     // Create link
//     await prisma.userSkill.create({
//       data: {
//         userId,
//         skillId: skill.id,
//       },
//     });
//   }
// }









import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getSession } from "@auth0/nextjs-auth0";

const prisma = new PrismaClient();
const PREDEFINED_SKILLS = [
  "React",
  "Python",
  "UI/UX",
  "Blockchain",
  "TypeScript",
  "Machine Learning",
];

// Helper function to get an Auth0 Management API token
async function getManagementApiToken() {
  const res = await fetch(`${process.env.AUTH0_ISSUER_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: process.env.AUTH0_CLIENT_ID,
      client_secret: process.env.AUTH0_CLIENT_SECRET,
      audience: `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/`,
      grant_type: "client_credentials",
    }),
  });
  const data = await res.json();
  console.log("Management API token response:", data); // temporary log for debugging
  if (!data.access_token) {
    throw new Error("Failed to obtain Auth0 management token");
  }
  return data.access_token;
}

// Helper function to update Auth0 user app_metadata
async function updateAuth0User(auth0UserId, role) {
  const managementToken = await getManagementApiToken();
  const res = await fetch(
    `${process.env.AUTH0_ISSUER_BASE_URL}/api/v2/users/${encodeURIComponent(auth0UserId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${managementToken}`,
      },
      body: JSON.stringify({
        app_metadata: {
          roles: [role],
        },
      }),
    }
  );
  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Auth0 update failed: ${errorText}`);
  }
}

export async function POST(req) {
  try {
    const session = await getSession(req);
    
    // 1. Check if user is logged in
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Parse request body
    const {
      username,
      skills = [],
      name,
      number,
      phone_extension,
      profilePicture,
      interests,
      role, // e.g. "Manager" or "Contributor"
      timezone,
      qualifications,
    } = await req.json();

    const email = session.user.email;

    // 3. Check if there is an existing user with this email
    const existingUser = await prisma.user.findUnique({
      where: { email },
      include: { skills: true },
    });

    let userRecord;
    // 4. If user does NOT exist => Create
    if (!existingUser) {
      // Check if the requested username is already taken by *any* user
      const existingUsername = await prisma.user.findUnique({
        where: { username },
      });
      if (existingUsername) {
        return NextResponse.json(
          { error: "Username already exists" },
          { status: 400 }
        );
      }

      // Create new user in your database
      userRecord = await prisma.user.create({
        data: {
          email,
          name,
          username,
          number,
          phone_extension,
          profile_picture: profilePicture,
          interests,
          role,
          timezone,
          qualifications,
          joined_at: new Date(),
        },
      });

      // Process skills
      await updateUserSkills(userRecord.id, skills);
    } else {
      // 5. If user ALREADY exists => Update
      if (username !== existingUser.username) {
        const otherUserWithUsername = await prisma.user.findUnique({
          where: { username },
        });
        if (otherUserWithUsername && otherUserWithUsername.id !== existingUser.id) {
          return NextResponse.json(
            { error: "Username already exists" },
            { status: 400 }
          );
        }
      }

      userRecord = await prisma.user.update({
        where: { id: existingUser.id },
        data: {
          name,
          username,
          number,
          phone_extension,
          profile_picture: profilePicture,
          interests,
          role,
          timezone,
          qualifications,
        },
      });

      await updateUserSkills(userRecord.id, skills);
    }

    // 6. Sync the role to Auth0 by updating the user's app_metadata
    // The Auth0 user ID is usually in session.user.sub
    await updateAuth0User(session.user.sub, role);

    return NextResponse.json({ success: true, user: userRecord }, { status: existingUser ? 200 : 201 });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

/**
 * Helper function to overwrite user’s skills.
 */
async function updateUserSkills(userId, skills) {
  await prisma.userSkill.deleteMany({ where: { userId } });
  for (const skillName of skills) {
    const trimmedSkill = skillName.trim();
    if (!trimmedSkill) continue;
    const skill = await prisma.skill.upsert({
      where: { name: trimmedSkill },
      update: {},
      create: {
        name: trimmedSkill,
        isCustom: !PREDEFINED_SKILLS.includes(trimmedSkill),
      },
    });
    await prisma.userSkill.create({
      data: { userId, skillId: skill.id },
    });
  }
}
