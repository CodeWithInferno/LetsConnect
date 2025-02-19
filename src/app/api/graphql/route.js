




import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { mergeResolvers } from "@graphql-tools/merge";
import { getSession } from "@auth0/nextjs-auth0";
import typeDefs from "../../../../graphql/schema";
import mainResolvers from "../../../../graphql/resolvers";
import userResolvers from "../../../../graphql/userResolvers";
import calendarResolvers from "../../../../graphql/CalendarResolver";
import prisma from "../../../lib/prisma";
import {profileResolvers} from "../../../../graphql/Profile";
import projectDetailsResolvers from "../../../../graphql/ProjectDetails";
import personalChatResolvers from "../../../../graphql/Personalchat";

// Merge resolvers
const mergedResolvers = mergeResolvers([
  mainResolvers,
  userResolvers,
  calendarResolvers,
  profileResolvers,
  projectDetailsResolvers,
  personalChatResolvers,

]);

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
        user = await prisma.user.findUnique({
          where: { email: session.user.email },
          include: { skills: { include: { skill: true } } },
        });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: session.user.email,
              name: session.user.name || session.user.nickname,
              username: session.user.email.split('@')[0],
              profile_picture: session.user.picture,
            },
            include: { skills: { include: { skill: true } } },
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
