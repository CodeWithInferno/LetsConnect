module.exports = {
  Query: {
    myProfile: async (_, __, { prisma, user }) => {
      if (!user) throw new Error("Not authenticated");
      
      return prisma.user.findUnique({
        where: { id: user.id },
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          organizations: {
            include: {
              organization: true
            }
          }
        }
      });
    }
  },

  Mutation: {
    updateProfile: async (_, { input }, { prisma, user }) => {
      if (!user) throw new Error("Not authenticated");

      if (input.username?.trim() === "") {
        throw new Error("Username cannot be empty");
      }

      // Handle skill connections
      const skillUpdates = input.skills 
        ? {
            skills: {
              deleteMany: {},
              create: input.skills.map(skillId => ({
                skill: { connect: { id: skillId } }
              }))
            }
          }
        : {};

      return prisma.user.update({
        where: { id: user.id },
        data: {
          name: input.name,
          username: input.username,
          bio: input.bio,
          website: input.website,
          location: input.location,
          profile_picture: input.profile_picture,
          ...skillUpdates
        },
        include: {
          skills: {
            include: {
              skill: true
            }
          },
          organizations: {
            include: {
              organization: true
            }
          }
        }
      });
    }
  }
};