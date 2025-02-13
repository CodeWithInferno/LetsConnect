// module.exports = {
//   Query: {
//     myProfile: async (_, __, { prisma, user }) => {
//       if (!user) throw new Error("Not authenticated");
      
//       return prisma.user.findUnique({
//         where: { id: user.id },
//         include: {
//           skills: {
//             include: {
//               skill: true
//             }
//           },
//           organizations: {
//             include: {
//               organization: true
//             }
//           }
//         }
//       });
//     },
//     allSkills: async (_, __, { prisma }) => {
//       return prisma.skill.findMany();
//     },
//   },

//   Mutation: {
//     updateProfile: async (_, { input }, { prisma, user }) => {
//       if (!user) throw new Error("Not authenticated");

//       if (input.username?.trim() === "") {
//         throw new Error("Username cannot be empty");
//       }

//       // Handle skill connections
//       const skillUpdates = input.skills 
//         ? {
//             skills: {
//               deleteMany: {},
//               create: input.skills.map(skillId => ({
//                 skill: { connect: { id: skillId } }
//               }))
//             }
//           }
//         : {};

//       return prisma.user.update({
//         where: { id: user.id },
//         data: {
//           name: input.name,
//           username: input.username,
//           bio: input.bio,
//           website: input.website,
//           location: input.location,
//           profile_picture: input.profile_picture,
//           ...skillUpdates
//         },
//         include: {
//           skills: {
//             include: {
//               skill: true
//             }
//           },
//           organizations: {
//             include: {
//               organization: true
//             }
//           }
//         }
//       });
//     }
//   }
// };

module.exports = {
  Query: {
    myProfile: async (_, __, { prisma, user }) => {
      if (!user) throw new Error("Not authenticated");
      return prisma.user.findUnique({
        where: { id: user.id },
        include: {
          skills: { include: { skill: true } },
          organizations: { include: { organization: true } },
          interests: { include: { interest: true } },
        },
      });
    },    
    allSkills: async (_, __, { prisma }) => {
      return prisma.skill.findMany();
    },
    allInterests: async (_, __, { prisma }) => {
      return prisma.interest.findMany();
    },
  },

  Mutation: {
    updateProfile: async (_, { input }, { prisma, user }) => {
      if (!user) throw new Error("Not authenticated");
      if (input.username?.trim() === "") {
        throw new Error("Username cannot be empty");
      }
      
      // Handle skill connections using connectOrCreate
      const skillUpdates = input.skills
        ? {
            skills: {
              deleteMany: {},
              create: input.skills.map((skillValue) => ({
                skill: {
                  connectOrCreate: {
                    where: { name: skillValue },
                    create: { name: skillValue, isCustom: false },
                  },
                },
              })),
            },
          }
        : {};
      
      // Handle interest connections using connectOrCreate
      const interestUpdates = input.interests
        ? {
            interests: {
              deleteMany: {},
              create: input.interests.map((interestValue) => ({
                interest: {
                  connectOrCreate: {
                    where: { name: interestValue },
                    create: { name: interestValue },
                  },
                },
              })),
            },
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
          ...skillUpdates,
          ...interestUpdates,
        },
        include: {
          skills: { include: { skill: true } },
          organizations: { include: { organization: true } },
          interests: { include: { interest: true } },
        },
      });
    },
  },
};
