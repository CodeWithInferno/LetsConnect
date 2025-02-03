
// import { ApolloServer } from "@apollo/server";
// import { startServerAndCreateNextHandler } from "@as-integrations/next";
// import { mergeResolvers } from "@graphql-tools/merge";
// import { getSession } from "@auth0/nextjs-auth0";
// import typeDefs from "/Users/pratham/Programming/Startup/letsconnect/graphql/schema"; // Relative path
// import resolvers from "/Users/pratham/Programming/Startup/letsconnect/graphql/resolvers.js"; // Relative path
// import prisma from "../../../lib/prisma"; // Relative path
// import userResolvers from "/Users/pratham/Programming/Startup/letsconnect/graphql/userResolvers.js"; // Relative path


// const mergedResolvers = mergeResolvers([resolvers, userResolvers]);


// const server = new ApolloServer({
//   typeDefs,
//   resolvers: mergedResolvers,
// });

// const handler = startServerAndCreateNextHandler(server, {
//   context: async (req) => {
//     try {
//       const session = await getSession(req);
//       let user = null;

//       if (session?.user?.email) {
//         user = await prisma.user.findUnique({
//           where: { email: session.user.email },
//           include: {
//             ownedProjects: true,
//             projects: true,
//           }
//         });

//         if (!user) {
//           user = await prisma.user.create({
//             data: {
//               email: session.user.email,
//               name: session.user.name || session.user.nickname,
//               username: session.user.email.split('@')[0],
//               profile_picture: session.user.picture,
//             }
//           });
//         }
//       }
//       return { prisma, user };
//     } catch (error) {
//       console.error("Context error:", error);
//       return { prisma, user: null };
//     }
//   }
// });

// export { handler as GET, handler as POST };















import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { mergeResolvers } from "@graphql-tools/merge";
import { getSession } from "@auth0/nextjs-auth0";
import typeDefs from "/Users/pratham/Programming/Startup/letsconnect/graphql/schema.js";
import mainResolvers from "/Users/pratham/Programming/Startup/letsconnect/graphql/resolvers.js";
import userResolvers from "/Users/pratham/Programming/Startup/letsconnect/graphql/userResolvers.js";
import prisma from "../../../lib/prisma";

const mergedResolvers = mergeResolvers([mainResolvers, userResolvers]);

const server = new ApolloServer({
  typeDefs,
  resolvers: mergedResolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async (req) => {
    try {
      const session = await getSession(req);
      let user = null;

      if (session?.user?.email) {
        // Use email as the unique identifier.
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: {
            skills: {
              include: { skill: true }
            }
          }
        });

        if (!user) {
          // Create the user if they don't exist.
          user = await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name || session.user.nickname,
              username: session.user.email.split('@')[0],
              profile_picture: session.user.picture,
              // any other fields you want to set initially
            },
            include: {
              skills: {
                include: { skill: true }
              }
            }
          });
        }
      }
      return { prisma, user };
    } catch (error) {
      console.error("Context error:", error);
      return { prisma, user: null };
    }
  }
});

export { handler as GET, handler as POST };
