// // graphql/ProjectDetails.js
// const ProjectDetails = {
//     Query: {
//       projectBySlug: async (_, { slug }, { prisma }) => {
//         try {
//           const project = await prisma.project.findUnique({
//             where: { id: slug },
//             include: {
//               owner: true,
//               organization: true,
//               members: {
//                 include: { user: true },
//               },
//               // other relations if needed...
//             },
//           });
//           if (!project) {
//             throw new Error("Project not found");
//           }
//           // Transform date fields to ISO strings
//           return {
//             ...project,
//             createdAt: project.createdAt ? project.createdAt.toISOString() : null,
//             updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
//             deadline: project.deadline ? project.deadline.toISOString() : null,
//             members: project.members.map(member => ({
//               ...member,
//               joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null,
//             })),
//           };
//         } catch (error) {
//           throw new Error(error.message);
//         }
//       },
//     },
//   };
  
//   module.exports = ProjectDetails;
  
















// graphql/ProjectDetails.js (Server-side resolver)

const ProjectDetails = {
  Query: {
    projectBySlug: async (_, { slug }, { prisma }) => {
      try {
        const project = await prisma.project.findUnique({
          // If "slug" in your DB is actually stored in a "slug" field, use { slug } instead of { id: slug }
          where: { id: slug },
          include: {
            owner: true,
            organization: true,
            members: {
              include: { user: true },
            },
            // Add these lines:
            languages: true,
            skillsRequired: {
              include: {
                skill: true,
              },
            },
          },
        });

        if (!project) {
          throw new Error("Project not found");
        }

        // Transform the date fields to ISO strings
        const transformedProject = {
          ...project,
          createdAt: project.createdAt ? project.createdAt.toISOString() : null,
          updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
          deadline: project.deadline ? project.deadline.toISOString() : null,
          members: project.members.map((member) => ({
            ...member,
            joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null,
          })),

          // Map through the pivot table (ProjectSkill) to return just the Skill objects
          skillsRequired: project.skillsRequired.map((ps) => ({
            ...ps.skill,
          })),

          // languages can return directly because it’s an array of ProgrammingLanguage
          languages: project.languages,
        };

        return transformedProject;
      } catch (error) {
        throw new Error(error.message);
      }
    },
  },
};

module.exports = ProjectDetails;
