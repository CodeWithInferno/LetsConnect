
// const resolvers = {
//   // =========================================================================
//   // QUERIES
//   // =========================================================================
//   Query: {
//     // ------------------------------------------------------------------------
//     // 1) projects (public or filtered)
//     // ------------------------------------------------------------------------
//     projects: async (_, args, context) => {
//       console.log("📌 Resolving 'projects' query...");

//       if (!context || !context.prisma) {
//         console.error("❌ Prisma client is missing in GraphQL context.");
//         throw new Error("❌ Prisma client is missing in GraphQL context.");
//       }

//       const { prisma } = context;
//       const filters = {};

//       if (args.projectType) {
//         filters.projectType = args.projectType;
//       }
//       if (args.organizationId) {
//         filters.organizationId = args.organizationId;
//       }
//       if (args.skillsRequired && args.skillsRequired.length) {
//         filters.skillsRequired = { hasSome: args.skillsRequired };
//       }

//       return prisma.project.findMany({
//         where: filters,
//         include: {
//           owner: {
//             select: {
//               id: true,
//               username: true,
//               name: true,
//               email: true,
//               profile_picture: true,
//             },
//           },
//           organization: {
//             select: {
//               id: true,
//               name: true,
//               logo: true,
//             },
//           },
//         },
//       });
//     },

//     // ------------------------------------------------------------------------
//     // 2) myProjects (projects owned by the user)
//     // ------------------------------------------------------------------------
//     myProjects: async (_, __, { prisma, user }) => {
//       console.log("📌 Resolving 'myProjects' query...");
//       console.log("Context User:", user);

//       if (!user) {
//         throw new Error("Not logged in. No user found.");
//       }

//       // Find the user in DB (including their project memberships)
//       const dbUser = await prisma.user.findUnique({
//         where: { email: user.email },
//         include: {
//           projectMemberships: {
//             include: {
//               project: {
//                 include: {
//                   owner: {
//                     select: {
//                       id: true,
//                       username: true,
//                       name: true,
//                       email: true,
//                       profile_picture: true,
//                     },
//                   },
//                   organization: {
//                     select: {
//                       id: true,
//                       name: true,
//                       logo: true,
//                     },
//                   },
//                 },
//               },
//             },
//           },
//         },
//       });

//       if (!dbUser) {
//         throw new Error("User record not found in DB.");
//       }

//       // Filter so we only return the user's owned projects
//       const ownedMemberships = dbUser.projectMemberships.filter(
//         (pm) => pm.project.ownerId === dbUser.id
//       );

//       return ownedMemberships.map((pm) => pm.project);
//     },

//     // ------------------------------------------------------------------------
//     // 3) myProject (specific project the user owns)
//     // ------------------------------------------------------------------------
//     myProject: async (_, { projectId }, { prisma, user }) => {
//       console.log(
//         `📌 Resolving 'myProject' query for projectId=${projectId}...`
//       );

//       if (!prisma || !user) {
//         throw new Error("❌ You must be logged in, and prisma must exist.");
//       }

//       const project = await prisma.project.findUnique({
//         where: { id: projectId },
//         include: {
//           owner: true,
//           members: {
//             include: { user: true },
//           },
//         },
//       });

//       if (!project) {
//         throw new Error("Project not found.");
//       }

//       if (project.ownerId !== user.id) {
//         throw new Error("Not authorized to view this project.");
//       }

//       return project;
//     },

//     // ------------------------------------------------------------------------
//     // 4) myUser
//     // ------------------------------------------------------------------------
//     myUser: async (_, __, { prisma, user }) => {
//       console.log("Resolving 'myUser' query...");

//       if (!user) {
//         throw new Error("Not logged in");
//       }

//       const dbUser = await prisma.user.findUnique({
//         where: { email: user.email },
//         include: {
//           organizations: {
//             include: {
//               organization: true,
//             },
//           },
//         },
//       });

//       if (!dbUser) {
//         throw new Error("User not found in DB");
//       }

//       return dbUser;
//     },

//     // ------------------------------------------------------------------------
//     // 5) myNotifications
//     // ------------------------------------------------------------------------
//     myNotifications: async (_, __, { prisma, user }) => {
//       if (!user) throw new Error("Not logged in");

//       return prisma.notification.findMany({
//         where: { userId: user.id },
//         orderBy: { createdAt: "desc" },
//       });
//     },

//     // ------------------------------------------------------------------------
//     // 6) kanbanBoard (fetch the Kanban board for a project)
//     // ------------------------------------------------------------------------
//     kanbanBoard: async (_, { projectId }, { prisma, user }) => {
//       if (!user) throw new Error("Not authenticated");
//       const board = await prisma.kanbanBoard.findUnique({
//         where: { projectId },
//         include: {
//           columns: {
//             orderBy: { order: "asc" }, // assuming columns use "order"
//             include: {
//               tasks: {
//                 include: { assignee: true },
//                 orderBy: { position: "asc" }, // tasks now ordered by "position"
//               },
//             },
//           },
//         },
//       });
//       if (!board) throw new Error("Kanban board not found");
//       return board;
//     },
//   },

//   // =========================================================================
//   // MUTATIONS
//   // =========================================================================
//   Mutation: {
//     createKanbanTask: async (
//       _,
//       { projectId, columnId, content, priority, dueDate, tags },
//       { prisma, user }
//     ) => {
//       if (!user) throw new Error("Not authenticated");

//       // Optionally, verify that the user is allowed to add tasks to the project

//       // Determine the new task's position by fetching existing tasks in the column
//       const existingTasks = await prisma.kanbanTask.findMany({
//         where: { columnId },
//         orderBy: { position: "asc" },
//       });
//       const newPosition =
//         existingTasks.length > 0
//           ? existingTasks[existingTasks.length - 1].position + 1
//           : 1;

//       // Create the new task
//       const newTask = await prisma.kanbanTask.create({
//         data: {
//           content,
//           priority,
//           dueDate: dueDate ? new Date(dueDate) : null,
//           tags: tags || [],
//           position: newPosition, // saves the ordering within the column
//           column: { connect: { id: columnId } },
//           project: { connect: { id: projectId } },
//         },
//         include: {
//           assignee: true,
//           column: true,
//           project: true,
//         },
//       });

//       return newTask;
//     },

//     // ------------------------------------------------------------------------
//     // 1) inviteMemberToProject
//     // ------------------------------------------------------------------------
//     inviteMemberToProject: async (
//       _,
//       { projectId, email, role },
//       { prisma, user }
//     ) => {
//       // Check ownership
//       const project = await prisma.project.findUnique({
//         where: { id: projectId },
//       });
//       if (!project || project.ownerId !== user.id) {
//         throw new Error("Not authorized to invite members to this project.");
//       }

//       // Find the invited user
//       const invitedUser = await prisma.user.findUnique({ where: { email } });
//       if (!invitedUser) {
//         throw new Error("User with that email not found");
//       }

//       // Create ProjectMember with status = PENDING
//       const newMember = await prisma.projectMember.create({
//         data: {
//           userId: invitedUser.id,
//           projectId: project.id,
//           role,
//           status: "PENDING",
//         },
//         include: { user: true },
//       });

//       // Create a notification row referencing that membership
//       await prisma.notification.create({
//         data: {
//           userId: invitedUser.id,
//           message: `You have been invited to join the project "${project.title}".`,
//           type: "INVITE",
//           projectId: project.id,
//           projectMemberId: newMember.id,
//         },
//       });

//       return newMember;
//     },

//     // ------------------------------------------------------------------------
//     // 2) acceptMembership
//     // ------------------------------------------------------------------------
//     acceptMembership: async (_, { projectMemberId }, { prisma, user }) => {
//       // Find the membership
//       const pm = await prisma.projectMember.findUnique({
//         where: { id: projectMemberId },
//         include: { user: true },
//       });
//       if (!pm) {
//         throw new Error("Membership not found");
//       }

//       // Must be the same user
//       if (pm.userId !== user.id) {
//         throw new Error("Not allowed to accept this membership.");
//       }

//       // Update status to ACTIVE
//       const updated = await prisma.projectMember.update({
//         where: { id: pm.id },
//         data: { status: "ACTIVE" },
//         include: { user: true },
//       });

//       return updated;
//     },

//     // ------------------------------------------------------------------------
//     // 3) markNotificationAsRead
//     // ------------------------------------------------------------------------
//     markNotificationAsRead: async (_, { notificationId }, { prisma, user }) => {
//       if (!user) throw new Error("Not logged in");

//       const notif = await prisma.notification.findUnique({
//         where: { id: notificationId },
//       });
//       if (!notif) throw new Error("Notification not found");
//       if (notif.userId !== user.id) throw new Error("Not authorized");

//       return prisma.notification.update({
//         where: { id: notificationId },
//         data: { read: true },
//       });
//     },

//     // ------------------------------------------------------------------------
//     // 4) rejectMembership
//     // ------------------------------------------------------------------------
//     rejectMembership: async (_, { projectMemberId }, { prisma, user }) => {
//       // Find the membership
//       const pm = await prisma.projectMember.findUnique({
//         where: { id: projectMemberId },
//         include: { user: true },
//       });
//       if (!pm) throw new Error("Membership not found");

//       // Must be the same user
//       if (pm.userId !== user.id) {
//         throw new Error("Not allowed to reject this membership.");
//       }

//       // Delete or set status = REJECTED (here we delete)
//       await prisma.projectMember.delete({ where: { id: projectMemberId } });

//       // Optionally mark the corresponding notification as read
//       await prisma.notification.updateMany({
//         where: { projectMemberId, userId: user.id },
//         data: { read: true },
//       });

//       return { success: true };
//     },

//     // ------------------------------------------------------------------------
//     // 5) applyToProject
//     // ------------------------------------------------------------------------
//     applyToProject: async (_, { projectId }, { prisma, user }) => {
//       if (!user) throw new Error("Not logged in");

//       // Check if user is already a member or pending
//       const existing = await prisma.projectMember.findUnique({
//         where: {
//           userId_projectId: {
//             userId: user.id,
//             projectId,
//           },
//         },
//       });
//       if (existing) {
//         throw new Error(
//           "You are already a member or have a pending application."
//         );
//       }

//       // Create membership with status = PENDING
//       return prisma.projectMember.create({
//         data: {
//           userId: user.id,
//           projectId,
//           role: "MEMBER", // default or "APPLICANT"
//           status: "PENDING",
//         },
//       });
//     },

//     // ------------------------------------------------------------------------
//     // 6) moveKanbanTask
//     // ------------------------------------------------------------------------
//     // In resolvers.js, within your Mutation object:
//     moveKanbanTask: async (
//       _,
//       { taskId, sourceColumnId, destinationColumnId, newIndex, projectId },
//       { prisma, user }
//     ) => {
//       if (!user) throw new Error("Not authenticated");

//       // Verify the user has access to the project
//       const membership = await prisma.projectMember.findFirst({
//         where: {
//           projectId,
//           userId: user.id,
//           status: "ACTIVE",
//         },
//       });

//       if (!membership) throw new Error("Not authorized");

//       // Update the task's column and position (use "position" instead of "order")
//       const updatedTask = await prisma.kanbanTask.update({
//         where: { id: taskId },
//         data: {
//           columnId: destinationColumnId,
//           position: newIndex, // <-- Update this field!
//         },
//         include: {
//           assignee: true,
//           column: true,
//           project: true,
//         },
//       });

//       return updatedTask;
//     },
//   },

//   // =========================================================================
//   // FIELD RESOLVERS
//   // =========================================================================
//   // --------------------------------------------------------------------------
//   // Project: fetch members from ProjectMember
//   // --------------------------------------------------------------------------
//   Project: {
//     members: async (parent, _args, { prisma }) => {
//       if (!prisma) {
//         console.error("❌ Prisma client is missing in GraphQL context.");
//         throw new Error("❌ Prisma client is missing in GraphQL context.");
//       }

//       return prisma.projectMember.findMany({
//         where: { projectId: parent.id },
//         include: { user: true },
//       });
//     },
//   },

//   // --------------------------------------------------------------------------
//   // User: organizations
//   // --------------------------------------------------------------------------
//   User: {
//     organizations: (parent) => {
//       // parent.organizations is an array of OrganizationMember
//       return parent.organizations.map((member) => member.organization);
//     },
//   },
// };

// module.exports = resolvers;















const resolvers = {
  // =========================================================================
  // QUERIES
  // =========================================================================
  Query: {
    // ------------------------------------------------------------------------
    // 1) projects (public or filtered)
    // ------------------------------------------------------------------------
    projects: async (_, args, context) => {
      console.log("📌 Resolving 'projects' query...");
    
      if (!context || !context.prisma) {
        console.error("❌ Prisma client is missing in GraphQL context.");
        throw new Error("❌ Prisma client is missing in GraphQL context.");
      }
    
      const { prisma } = context;
      const filters = {};
    
      if (args.projectType) {
        filters.projectType = args.projectType;
      }
      if (args.organizationId) {
        filters.organizationId = args.organizationId;
      }
      if (args.skillsRequired && args.skillsRequired.length) {
        filters.skillsRequired = { some: { id: { in: args.skillsRequired } } };
      }
    
      return prisma.project.findMany({
        where: filters,
        include: {
          owner: {
            select: {
              id: true,
              username: true,
              name: true,
              email: true,
              profile_picture: true,
            },
          },
          organization: {
            select: {
              id: true,
              name: true,
              logo: true,
            },
          },
          skillsRequired: true, // ✅ Include skills
          languages: true, // ✅ Include programming languages
        },
      });
    },
    

    // ------------------------------------------------------------------------
    // 2) myProjects (projects the user is a member of)
    // ------------------------------------------------------------------------
    myProjects: async (_, __, { prisma, user }) => {
      console.log("📌 Resolving 'myProjects' query...");
      console.log("Context User:", user);
    
      if (!user) {
        throw new Error("Not logged in. No user found.");
      }
    
      // Fetch the user and include all project memberships
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          projectMemberships: {
            include: {
              project: {
                include: {
                  owner: {
                    select: {
                      id: true,
                      username: true,
                      name: true,
                      email: true,
                      profile_picture: true,
                    },
                  },
                  organization: {
                    select: {
                      id: true,
                      name: true,
                      logo: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
    
      if (!dbUser) {
        throw new Error("User record not found in DB.");
      }
    
      // **Return all projects from the user's memberships (owner or contributor)**
      console.log("DB project memberships:", dbUser.projectMemberships);
      return dbUser.projectMemberships.map((pm) => pm.project);
    },
    

    // ------------------------------------------------------------------------
    // 3) myProject (fetch a specific project the user is part of)
    // ------------------------------------------------------------------------
    myProject: async (_, { projectId }, { prisma, user }) => {
      console.log(`📌 Resolving 'myProject' query for projectId=${projectId}...`);

      if (!prisma || !user) {
        throw new Error("❌ You must be logged in, and prisma must exist.");
      }

      const project = await prisma.project.findUnique({
        where: { id: projectId },
        include: {
          owner: true,
          members: {
            include: { user: true },
          },
        },
      });

      if (!project) {
        throw new Error("Project not found.");
      }

      // Allow access if the user is the owner...
      if (project.ownerId === user.id) {
        return project;
      }

      // ...or if the user is a member of the project
      const membership = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId,
          },
        },
      });
      if (!membership) {
        throw new Error("Not authorized to view this project.");
      }

      return project;
    },

    // ------------------------------------------------------------------------
    // 4) myUser
    // ------------------------------------------------------------------------
    myUser: async (_, __, { prisma, user }) => {
      console.log("📌 Resolving 'myUser' query...");
    
      if (!user) {
        throw new Error("Not logged in");
      }
    
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          skills: { include: { skill: true } },  // ✅ Ensure skills are included
          programmingLanguages: true,  // ✅ Ensure programming languages are included
        },
      });
    
      if (!dbUser) {
        throw new Error("User not found in DB");
      }
    
      console.log("✅ User fetched:", dbUser);
      return dbUser;
    },
    

    // ------------------------------------------------------------------------
    // 5) myNotifications
    // ------------------------------------------------------------------------
    myNotifications: async (_, __, { prisma, user }) => {
      if (!user) throw new Error("Not logged in");

      return prisma.notification.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: "desc" },
      });
    },

    // ------------------------------------------------------------------------
    // 6) kanbanBoard (fetch the Kanban board for a project)
    // ------------------------------------------------------------------------
    kanbanBoard: async (_, { projectId }, { prisma, user }) => {
      if (!user) throw new Error("Not authenticated");
      const board = await prisma.kanbanBoard.findUnique({
        where: { projectId },
        include: {
          columns: {
            orderBy: { order: "asc" }, // assuming columns use "order"
            include: {
              tasks: {
                include: { assignee: true },
                orderBy: { position: "asc" }, // tasks now ordered by "position"
              },
            },
          },
        },
      });
      if (!board) throw new Error("Kanban board not found");
      return board;
    },
  },

  // =========================================================================
  // MUTATIONS
  // =========================================================================
  Mutation: {
    createKanbanTask: async (
      _,
      { projectId, columnId, content, priority, dueDate, tags },
      { prisma, user }
    ) => {
      if (!user) throw new Error("Not authenticated");

      // Determine the new task's position by fetching existing tasks in the column
      const existingTasks = await prisma.kanbanTask.findMany({
        where: { columnId },
        orderBy: { position: "asc" },
      });
      const newPosition =
        existingTasks.length > 0
          ? existingTasks[existingTasks.length - 1].position + 1
          : 1;

      // Create the new task
      const newTask = await prisma.kanbanTask.create({
        data: {
          content,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: tags || [],
          position: newPosition, // saves the ordering within the column
          column: { connect: { id: columnId } },
          project: { connect: { id: projectId } },
        },
        include: {
          assignee: true,
          column: true,
          project: true,
        },
      });

      return newTask;
    },

    inviteMemberToProject: async (
      _,
      { projectId, email, role },
      { prisma, user }
    ) => {
      // Check ownership
      const project = await prisma.project.findUnique({
        where: { id: projectId },
      });
      if (!project || project.ownerId !== user.id) {
        throw new Error("Not authorized to invite members to this project.");
      }

      // Find the invited user
      const invitedUser = await prisma.user.findUnique({ where: { email } });
      if (!invitedUser) {
        throw new Error("User with that email not found");
      }

      // Create ProjectMember with status = PENDING
      const newMember = await prisma.projectMember.create({
        data: {
          userId: invitedUser.id,
          projectId: project.id,
          role,
          status: "PENDING",
        },
        include: { user: true },
      });

      // Create a notification row referencing that membership
      await prisma.notification.create({
        data: {
          userId: invitedUser.id,
          message: `You have been invited to join the project "${project.title}".`,
          type: "INVITE",
          projectId: project.id,
          projectMemberId: newMember.id,
        },
      });

      return newMember;
    },

    acceptMembership: async (_, { projectMemberId }, { prisma, user }) => {
      // Find the membership
      const pm = await prisma.projectMember.findUnique({
        where: { id: projectMemberId },
        include: { user: true },
      });
      if (!pm) {
        throw new Error("Membership not found");
      }

      // Must be the same user
      if (pm.userId !== user.id) {
        throw new Error("Not allowed to accept this membership.");
      }

      // Update status to ACTIVE
      const updated = await prisma.projectMember.update({
        where: { id: pm.id },
        data: { status: "ACTIVE" },
        include: { user: true },
      });

      return updated;
    },

    markNotificationAsRead: async (_, { notificationId }, { prisma, user }) => {
      if (!user) throw new Error("Not logged in");

      const notif = await prisma.notification.findUnique({
        where: { id: notificationId },
      });
      if (!notif) throw new Error("Notification not found");
      if (notif.userId !== user.id)
        throw new Error("Not authorized");

      return prisma.notification.update({
        where: { id: notificationId },
        data: { read: true },
      });
    },

    rejectMembership: async (_, { projectMemberId }, { prisma, user }) => {
      // Find the membership
      const pm = await prisma.projectMember.findUnique({
        where: { id: projectMemberId },
        include: { user: true },
      });
      if (!pm) throw new Error("Membership not found");

      // Must be the same user
      if (pm.userId !== user.id)
        throw new Error("Not allowed to reject this membership.");

      // Delete the membership
      await prisma.projectMember.delete({ where: { id: projectMemberId } });

      // Optionally mark the corresponding notification as read
      await prisma.notification.updateMany({
        where: { projectMemberId, userId: user.id },
        data: { read: true },
      });

      return { success: true };
    },

    applyToProject: async (_, { projectId }, { prisma, user }) => {
      if (!user) throw new Error("Not logged in");

      // Check if user is already a member or pending
      const existing = await prisma.projectMember.findUnique({
        where: {
          userId_projectId: {
            userId: user.id,
            projectId,
          },
        },
      });
      if (existing) {
        throw new Error(
          "You are already a member or have a pending application."
        );
      }

      // Create membership with status = PENDING
      return prisma.projectMember.create({
        data: {
          userId: user.id,
          projectId,
          role: "MEMBER", // default role for new members
          status: "PENDING",
        },
      });
    },

    moveKanbanTask: async (
      _,
      { taskId, sourceColumnId, destinationColumnId, newIndex, projectId },
      { prisma, user }
    ) => {
      if (!user) throw new Error("Not authenticated");

      // Verify the user has access to the project
      const membership = await prisma.projectMember.findFirst({
        where: {
          projectId,
          userId: user.id,
          status: "ACTIVE",
        },
      });

      if (!membership) throw new Error("Not authorized");

      // Update the task's column and position
      const updatedTask = await prisma.kanbanTask.update({
        where: { id: taskId },
        data: {
          columnId: destinationColumnId,
          position: newIndex,
        },
        include: {
          assignee: true,
          column: true,
          project: true,
        },
      });

      return updatedTask;
    },
  },

  // =========================================================================
  // FIELD RESOLVERS
  // =========================================================================
  // --------------------------------------------------------------------------
  // Project: fetch members from ProjectMember
  // --------------------------------------------------------------------------
  Project: {
    members: async (parent, _args, { prisma }) => {
      if (!prisma) {
        console.error("❌ Prisma client is missing in GraphQL context.");
        throw new Error("❌ Prisma client is missing in GraphQL context.");
      }

      return prisma.projectMember.findMany({
        where: { projectId: parent.id },
        include: { user: true },
      });
    },
  },

  // --------------------------------------------------------------------------
  // User: organizations
  // --------------------------------------------------------------------------
  User: {
    organizations: (parent) => {
      // Map OrganizationMember to Organization
      return parent.organizations.map((member) => member.organization);
    },
  },
};

module.exports = resolvers;
