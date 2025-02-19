// graphql/Personalchat.js
export const personalChatResolvers = {
    Query: {
      // Fetches (or creates) a PRIVATE chat room between the logged-in user and the recipient
      personalChat: async (_parent, { recipientId }, { prisma, user }) => {
        if (!user) throw new Error("Not authenticated");
  
        // Look for an existing private chat that has both participants
        let chatRoom = await prisma.chatRoom.findFirst({
          where: {
            roomType: "PRIVATE",
            participants: {
              some: { userId: user.id }
            },
            AND: {
              participants: {
                some: { userId: recipientId }
              }
            }
          },
          include: {
            participants: true,
            messages: {
              orderBy: { createdAt: "asc" }
            }
          }
        });
  
        // If not found, create a new PRIVATE chat room
        if (!chatRoom) {
          chatRoom = await prisma.chatRoom.create({
            data: {
              roomType: "PRIVATE",
              participants: {
                create: [
                  { user: { connect: { id: user.id } } },
                  { user: { connect: { id: recipientId } } }
                ]
              }
            },
            include: {
              participants: true,
              messages: true
            }
          });
        }
  
        return chatRoom;
      }
    },
  
    Mutation: {
      // Sends a message in a given chat room.
      sendChatMessage: async (_parent, { roomId, content }, { prisma, user }) => {
        if (!user) throw new Error("Not authenticated");
  
        // Verify the user is a participant in the room
        const room = await prisma.chatRoom.findUnique({
          where: { id: roomId },
          include: { participants: true }
        });
        if (!room || !room.participants.some((p) => p.userId === user.id)) {
          throw new Error("Not authorized to send messages in this room");
        }
  
        // Create and return the new chat message
        const message = await prisma.chatMessage.create({
          data: {
            roomId,
            senderId: user.id,
            content
          }
        });
        return message;
      }
    },
  
    // Field-level resolvers for ChatRoom and ChatMessage
    ChatRoom: {
      // Resolve the participants by fetching the related users
      participants: async (parent, _args, { prisma }) => {
        const participants = await prisma.chatRoomParticipant.findMany({
          where: { roomId: parent.id },
          include: { user: true }
        });
        return participants.map((p) => p.user);
      },
      // Optionally, resolve messages sorted by creation time
      messages: async (parent, _args, { prisma }) => {
        const messages = await prisma.chatMessage.findMany({
          where: { roomId: parent.id },
          orderBy: { createdAt: "asc" }
        });
        return messages;
      }
    },
    ChatMessage: {
      // Resolve the sender field by fetching the user data
      sender: async (parent, _args, { prisma }) => {
        return await prisma.user.findUnique({ where: { id: parent.senderId } });
      }
    }
  };
  
  export default personalChatResolvers;
  