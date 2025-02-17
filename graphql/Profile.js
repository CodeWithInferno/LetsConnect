export const profileResolvers = {
  Query: {
    myProfile: async (_, __, { prisma, user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      const profileData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          organizations: {
            include: { organization: true },
          },
          programmingLanguages: { include: { language: true } },
        },
      });
      if (!profileData) {
        throw new Error("Profile not found");
      }
      return {
        ...profileData,
        joinedAt: profileData.joined_at.toISOString(),
        // Ensure we always return an array (even if empty)
        programmingLanguages: (profileData.programmingLanguages || [])
          .map(pl => pl.language)
          .filter(lang => lang != null),
      };
    },
    userByUsername: async (_, { username }, { prisma }) => {
      return prisma.user.findUnique({
        where: { username },
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          organizations: true,
          programmingLanguages: { include: { language: true } },
        },
      });
    },
    // If you want userProjects:
    userProjects: async (_, { username }, { prisma }) => {
      // 1) find user by username
      const user = await prisma.user.findUnique({
        where: { username },
      });
      if (!user) return [];
      // 2) find projects or memberships
      const memberships = await prisma.projectMember.findMany({
        where: { userId: user.id },
        include: {
          project: { include: { languages: true } },
        },
      });
      // 3) map the membership to the actual project
      return memberships.map((m) => m.project);
    },
  },
  Mutation: {
    updateProfile: async (_, { input }, { prisma, user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      const userId = user.id;
      const data = {
        name: input.name,
        username: input.username,
        bio: input.bio,
        website: input.website,
        location: input.location,
        profile_picture: input.profile_picture,
      };

      if (input.skills) {
        data.skills = {
          deleteMany: { userId },
          create: input.skills.map(skillId => ({
            skill: { connect: { id: skillId } },
          })),
        };
      }
      if (input.interests) {
        data.interests = {
          deleteMany: { userId },
          create: input.interests.map(interestId => ({
            interest: { connect: { id: interestId } },
          })),
        };
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data,
        include: {
          skills: { include: { skill: true } },
          interests: { include: { interest: true } },
          organizations: true,
          programmingLanguages: { include: { language: true } },
        },
      });

      return {
        ...updatedUser,
        joinedAt: updatedUser.joined_at.toISOString(),
        programmingLanguages: (updatedUser.programmingLanguages || [])
          .map(pl => pl.language)
          .filter(lang => lang != null),
      };
    },
  },
};
