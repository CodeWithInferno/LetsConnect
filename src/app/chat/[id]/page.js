'use client';
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';

// GraphQL query to fetch (or create) a personal chat room
const PERSONAL_CHAT_QUERY = `
  query PersonalChat($recipientId: ID!) {
    personalChat(recipientId: $recipientId) {
      id
      participants {
        id
        username
        profile_picture
      }
      messages {
        id
        content
        createdAt
        sender {
          id
          username
          profile_picture
        }
      }
    }
  }
`;

// GraphQL mutation to send a message
const SEND_CHAT_MESSAGE_MUTATION = `
  mutation SendChatMessage($roomId: ID!, $content: String!) {
    sendChatMessage(roomId: $roomId, content: $content) {
      id
      content
      createdAt
      sender {
        id
        username
      }
    }
  }
`;

export default function ChatRoom() {
  const { id: recipientId } = useParams();
  const [chatRoom, setChatRoom] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const GRAPHQL_ENDPOINT = "/api/graphql"; // Adjust if needed

  // Function to fetch the chat room data
  const fetchChatRoom = async () => {
    if (!recipientId) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: PERSONAL_CHAT_QUERY,
          variables: { recipientId }
        })
      });
      const result = await response.json();
      if (result.errors) {
        setError(result.errors[0].message);
      } else {
        setChatRoom(result.data.personalChat);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  // Poll the server every 5 seconds for new messages
  useEffect(() => {
    if (recipientId) {
      fetchChatRoom();
      const interval = setInterval(fetchChatRoom, 5000);
      return () => clearInterval(interval);
    }
  }, [recipientId]);

  // Function to handle sending a message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !chatRoom) return;
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: SEND_CHAT_MESSAGE_MUTATION,
          variables: {
            roomId: chatRoom.id,
            content: message
          }
        })
      });
      const result = await response.json();
      if (result.errors) {
        console.error(result.errors);
      } else {
        setMessage("");
        // Refresh chat room after sending the message
        fetchChatRoom();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatRoom]);

  if (loading) return <p className="text-white p-4">Loading chat...</p>;
  if (error) return <p className="text-red-500 p-4">Error: {error}</p>;
  if (!chatRoom) return <p className="text-white p-4">No chat room data.</p>;

  // Derive the other participant.
  const otherParticipant =
    chatRoom.participants.find(p => p.id !== chatRoom.messages[0]?.sender?.id) || { username: "Chat" };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Chat Header */}
      <header className="flex items-center p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          {otherParticipant.profile_picture && (
            <img
              src={otherParticipant.profile_picture}
              alt={otherParticipant.username}
              className="w-10 h-10 rounded-full"
            />
          )}
          <h2 className="text-xl font-semibold">{otherParticipant.username}</h2>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-grow overflow-y-auto p-4">
        {chatRoom.messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-4 flex ${
              msg.sender.id === otherParticipant.id ? "justify-start" : "justify-end"
            }`}
          >
            <div className="max-w-xs p-2 rounded-lg bg-gray-800">
              <p className="text-sm">{msg.content}</p>
              <span className="text-xs text-gray-500">
                {new Date(msg.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-700">
        <form onSubmit={handleSendMessage} className="flex">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-2 rounded-l-lg bg-gray-800 border border-gray-600 focus:outline-none"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button
            type="submit"
            className="p-2 bg-blue-600 rounded-r-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
