const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { PrismaClient } = require("@prisma/client");
const { getSession } = require("@auth0/nextjs-auth0");
const typeDefs = require("./graphql/schema");
const resolvers = require("./graphql/resolvers");

const prisma = new PrismaClient();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

(async () => {
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async ({ req }) => {
      try {
        const session = await getSession(req);
        let user = null;

        if (session?.user?.email) {
          user = await prisma.user.findUnique({
            where: { email: session.user.email },
          });

          if (!user) {
            user = await prisma.user.create({
              data: {
                email: session.user.email,
                name: session.user.name || "New User",
                username: session.user.email.split('@')[0]
              }
            });
          }
        }

        return { prisma, user };
      } catch (err) {
        console.error("Context error:", err);
        return { prisma, user: null };
      }
    },
  });

  console.log(`🚀 Server ready at ${url}`);
})();