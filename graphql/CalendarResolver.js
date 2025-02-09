// Calendar.js

module.exports = {
    Query: {
      // Returns all calendar events for a given project.
      calendarEvents: async (_, { projectId }, { prisma, user }) => {
        // (Optionally, verify that user is authorized to view these events.)
        const events = await prisma.calendarEvent.findMany({
          where: { projectId },
          include: {
            organizer: {
              select: { id: true, name: true, email: true },
            },
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
            participants: {
              include: { user: { select: { id: true, name: true, email: true } } },
            },
          },
          orderBy: { startTime: 'asc' },
        });
        console.log(`Fetched ${events.length} events for projectId ${projectId}:`, JSON.stringify(events, null, 2));

        return events;
      },
  
      // Returns a specific calendar event by ID.
      calendarEvent: async (_, { eventId }, { prisma, user }) => {
        const event = await prisma.calendarEvent.findUnique({
          where: { id: eventId },
          include: {
            organizer: {
              select: { id: true, name: true, email: true },
            },
            assignedTo: {
              select: { id: true, name: true, email: true },
            },
            participants: {
              include: { user: { select: { id: true, name: true, email: true } } },
            },
          },
        });
        if (!event) {
          throw new Error("Calendar event not found.");
        }
        return event;
      },
    },
  
    Mutation: {
      // Creates a new calendar event.
      createCalendarEvent: async (_, args, { prisma, user }) => {
        // Make sure prisma exists.
        if (!prisma) {
          throw new Error("Prisma client not available in context.");
        }
        const eventData = {
          title: args.title,
          description: args.description,
          startTime: new Date(args.startTime),
          endTime: new Date(args.endTime),
          location: args.location,
          recurrence: args.recurrence,
          reminderMinutesBefore: args.reminderMinutesBefore ? parseInt(args.reminderMinutesBefore) : null,
          // Connect the organizer using the logged-in user
          organizer: { connect: { id: user.id } },
          ...(args.projectId ? { project: { connect: { id: args.projectId } } } : {}),
          ...(args.assignedTo ? { assignedTo: { connect: { id: args.assignedTo } } } : {}),
          priority: args.priority,
          deadline: args.deadline ? new Date(args.deadline) : null,
        };
      
        return await prisma.calendarEvent.create({
          data: eventData,
          include: {
            organizer: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } },
          },
        });
      },
      
  
      // Updates an existing calendar event.
      updateCalendarEvent: async (_, args, { prisma, user }) => {
        // args should include the eventId and any fields to update.
        const updateData = {
          title: args.title,
          description: args.description,
          startTime: args.startTime ? new Date(args.startTime) : undefined,
          endTime: args.endTime ? new Date(args.endTime) : undefined,
          location: args.location,
          recurrence: args.recurrence,
          reminderMinutesBefore: args.reminderMinutesBefore ? parseInt(args.reminderMinutesBefore) : undefined,
          // If assignedTo is provided, connect to that user.
          ...(args.assignedTo ? { assignedTo: { connect: { id: args.assignedTo } } } : {}),
        };
  
        const updatedEvent = await prisma.calendarEvent.update({
          where: { id: args.eventId },
          data: updateData,
          include: {
            organizer: { select: { id: true, name: true, email: true } },
            assignedTo: { select: { id: true, name: true, email: true } },
          },
        });
        return updatedEvent;
      },
  
      // Deletes a calendar event.
      deleteCalendarEvent: async (_, { eventId }, { prisma, user }) => {
        // Optionally, check if user is the organizer before deleting.
        const event = await prisma.calendarEvent.findUnique({ where: { id: eventId } });
        if (!event) {
          throw new Error("Event not found.");
        }
        if (event.organizerId !== user.id) {
          throw new Error("Not authorized to delete this event.");
        }
        const deletedEvent = await prisma.calendarEvent.delete({
          where: { id: eventId },
        });
        return deletedEvent;
      },
    },
  };
  