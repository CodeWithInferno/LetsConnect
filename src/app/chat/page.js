'use client';
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // Updated import

const GRAPHQL_ENDPOINT = "/api/graphql";

// Define GraphQL queries/mutations as plain strings.
const GET_USER_CHATS = `
  query GetUserChats {
    myChats {
      id
      participants {
        id
        username
      }
      lastMessage {
        content
        createdAt
      }
    }
  }
`;

const USER_BY_USERNAME = `
  query UserByUsername($username: String!) {
    userByUsername(username: $username) {
      id
      username
    }
  }
`;

const PERSONAL_CHAT = `
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

// Helper function to call your GraphQL API.
async function fetchGraphQL(query, variables = {}) {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

export default function ChatDashboard() {
  const router = useRouter();
  const [chats, setChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(false);
  const [errorChats, setErrorChats] = useState(null);

  const [recipientUsername, setRecipientUsername] = useState("");
  const [loadingUser, setLoadingUser] = useState(false);
  const [errorUser, setErrorUser] = useState(null);

  const [loadingChat, setLoadingChat] = useState(false);
  const [errorChat, setErrorChat] = useState(null);

  // Load user's chats on mount.
  useEffect(() => {
    async function loadChats() {
      setLoadingChats(true);
      try {
        const result = await fetchGraphQL(GET_USER_CHATS);
        if (result.errors) {
          setErrorChats(result.errors[0].message);
        } else {
          setChats(result.data.myChats);
        }
      } catch (err) {
        setErrorChats(err.message);
      }
      setLoadingChats(false);
    }
    loadChats();
  }, []);

  // Handle starting a new chat.
  const handleStartChat = async () => {
    if (!recipientUsername.trim()) return;
    setErrorUser(null);
    setErrorChat(null);

    // Lookup user by username.
    setLoadingUser(true);
    try {
      const userResult = await fetchGraphQL(USER_BY_USERNAME, {
        username: recipientUsername,
      });
      setLoadingUser(false);
      if (userResult.errors) {
        setErrorUser(userResult.errors[0].message);
        return;
      }
      if (!userResult.data.userByUsername) {
        setErrorUser("User not found");
        return;
      }
      const recipientId = userResult.data.userByUsername.id;

      // Create or get a personal chat.
      setLoadingChat(true);
      const chatResult = await fetchGraphQL(PERSONAL_CHAT, { recipientId });
      setLoadingChat(false);
      if (chatResult.errors) {
        setErrorChat(chatResult.errors[0].message);
        return;
      }
      if (chatResult.data.personalChat) {
        router.push(`/chat/${chatResult.data.personalChat.id}`);
      }
    } catch (err) {
      setLoadingUser(false);
      setLoadingChat(false);
      setErrorUser(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <h1 className="text-2xl mb-4">Chat Dashboard</h1>
      {/* New Chat Starter */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Enter username to chat with"
          value={recipientUsername}
          onChange={(e) => setRecipientUsername(e.target.value)}
          className="p-2 rounded bg-gray-800 border border-gray-600 focus:outline-none mr-2"
        />
        <button
          onClick={handleStartChat}
          className="p-2 bg-blue-600 rounded hover:bg-blue-700"
        >
          Start Chat
        </button>
        {loadingUser && <p className="text-gray-400 mt-2">Finding user...</p>}
        {errorUser && <p className="text-red-500 mt-2">Error: {errorUser}</p>}
        {loadingChat && <p className="text-gray-400 mt-2">Starting chat...</p>}
        {errorChat && <p className="text-red-500 mt-2">Error: {errorChat}</p>}
      </div>

      {/* Existing Chats */}
      {loadingChats ? (
        <p className="text-white p-4">Loading chats...</p>
      ) : errorChats ? (
        <p className="text-red-500 p-4">Error loading chats: {errorChats}</p>
      ) : chats && chats.length > 0 ? (
        chats.map((chat) => (
          <div key={chat.id} className="p-4 border-b border-gray-700">
            <Link href={`/chat/${chat.id}`}>
              <a className="block hover:bg-gray-800 p-2 rounded">
                <h2 className="text-xl">
                  {chat.participants.map((p) => p.username).join(", ")}
                </h2>
                {chat.lastMessage && (
                  <p className="text-gray-400">{chat.lastMessage.content}</p>
                )}
              </a>
            </Link>
          </div>
        ))
      ) : (
        <p>No chats available.</p>
      )}
    </div>
  );
}
