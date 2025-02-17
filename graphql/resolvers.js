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
        filters.skillsRequired = {
          some: { skill: { id: { in: args.skillsRequired } } },
        };
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
          // Include the many-to-many relation for skills:
          skillsRequired: { include: { skill: true } },
          languages: true,
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
    
// In your myUser resolver
      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
        include: {
          skills: { include: { skill: true } },
          programmingLanguages: true,
          organizations: { // Add this section
            include: {
              organization: true // Include actual organization data
            }
          }
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
            orderBy: { order: "asc" },
            include: {
              tasks: {
                include: { assignee: true, lastModifiedByUser: true, },
                orderBy: { position: "asc" },
              },
            },
          },
        },
      });
      if (!board) throw new Error("Kanban board not found");
      return board;
    },
    globalSearch: async (_, { term }, { prisma }) => {
      const users = await prisma.user.findMany({
        where: {
          OR: [
            { username: { contains: term, mode: "insensitive" } },
            { name: { contains: term, mode: "insensitive" } },
          ],
        },
        select: {
          id: true,
          username: true,
          name: true,
          // more fields if you want
        },
      });
      // Search Organizations (by name)
      const organizations = await prisma.organization.findMany({
        where: {
          name: { contains: term, mode: "insensitive" },
        },
        select: {
          id: true,
          name: true,
          logo: true,
          // remove slug unless you have one
        },
      });
    
      const projects = await prisma.project.findMany({
        where: {
          title: { contains: term, mode: "insensitive" },
        },
        select: {
          id: true,
          title: true,
          // remove slug unless you have one
        },
      });
      
      // Attach a __typename field so the client can differentiate
      const results = [
        ...users.map(u => ({ __typename: "User", ...u })),
        ...organizations.map(o => ({ __typename: "Organization", ...o })),
        ...projects.map(p => ({ __typename: "Project", ...p })),
      ];
    
      return results;
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
    
      // Determine the new task's position
      const existingTasks = await prisma.kanbanTask.findMany({
        where: { columnId },
        orderBy: { position: "asc" },
      });
      const newPosition =
        existingTasks.length > 0
          ? existingTasks[existingTasks.length - 1].position + 1
          : 1;
    
      // Create the new task and record the creator as the last modifier
      const newTask = await prisma.kanbanTask.create({
        data: {
          content,
          priority,
          dueDate: dueDate ? new Date(dueDate) : null,
          tags: tags || [],
          position: newPosition,
          column: { connect: { id: columnId } },
          project: { connect: { id: projectId } },
          lastModifiedByUser: { connect: { id: user.id } },
        },
        include: {
          assignee: true,
          column: true,
          project: true,
          lastModifiedByUser: true,
          
        },
      });
      
      console.log("New Task Created:", newTask);
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
      // 1) Find the membership, including the project so we know the ownerId
      const pm = await prisma.projectMember.findUnique({
        where: { id: projectMemberId },
        include: {
          user: true,
          project: true, // so we can check who owns the project
        },
      });
      if (!pm) {
        throw new Error("Membership not found");
      }
    
      // 2) Check if the currently logged-in user is:
      //    a) the user themself, or b) the project owner
      const isInvitedUser = pm.userId === user.id;
      const isProjectOwner = pm.project?.ownerId === user.id;
    
      if (!isInvitedUser && !isProjectOwner) {
        throw new Error("Not allowed to accept this membership.");
      }
    
      // 3) Update status to ACTIVE
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
      // 1) Find the membership
      const pm = await prisma.projectMember.findUnique({
        where: { id: projectMemberId },
        include: {
          user: true,
          project: true, 
        },
      });
      if (!pm) throw new Error("Membership not found");
    
      // 2) Either the invited user OR the project owner can reject
      const isInvitedUser = pm.userId === user.id;
      const isProjectOwner = pm.project?.ownerId === user.id;
    
      if (!isInvitedUser && !isProjectOwner) {
        throw new Error("Not allowed to reject this membership.");
      }
    
      // 3) If allowed, remove the membership
      await prisma.projectMember.delete({ where: { id: projectMemberId } });
    
      // Optionally mark the corresponding notification as read
      await prisma.notification.updateMany({
        where: { projectMemberId, userId: pm.userId },
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
    
      // Update the task's column, position, and record who modified it
      const updatedTask = await prisma.kanbanTask.update({
        where: { id: taskId },
        data: {
          columnId: destinationColumnId,
          position: newIndex,
          lastModifiedBy: user.id,  // Record the user making the change
        },
        include: {
          lastModifiedByUser: true,
          assignee: true,
          column: true,
          project: true,
            // Include relation so it’s returned
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
    skillsRequired: (parent) => {
      // Ensure that parent.skillsRequired is an array of ProjectSkill join records.
      return parent.skillsRequired ? parent.skillsRequired.map((ps) => ps.skill) : [];
    },
    members: async (parent, _args, { prisma }) => {
      return prisma.projectMember.findMany({
        where: { projectId: parent.id },
        include: { user: true },
      });
    

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
