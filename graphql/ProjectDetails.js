// graphql/ProjectDetails.js
const ProjectDetails = {
    Query: {
      projectBySlug: async (_, { slug }, { prisma }) => {
        try {
          const project = await prisma.project.findUnique({
            where: { id: slug },
            include: {
              owner: true,
              organization: true,
              members: {
                include: { user: true },
              },
              // other relations if needed...
            },
          });
          if (!project) {
            throw new Error("Project not found");
          }
          // Transform date fields to ISO strings
          return {
            ...project,
            createdAt: project.createdAt ? project.createdAt.toISOString() : null,
            updatedAt: project.updatedAt ? project.updatedAt.toISOString() : null,
            deadline: project.deadline ? project.deadline.toISOString() : null,
            members: project.members.map(member => ({
              ...member,
              joinedAt: member.joinedAt ? member.joinedAt.toISOString() : null,
            })),
          };
        } catch (error) {
          throw new Error(error.message);
        }
      },
    },
  };
  
  module.exports = ProjectDetails;
  