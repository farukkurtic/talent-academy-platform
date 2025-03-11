import { createContext, useState, useContext, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import io from "socket.io-client";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState(() => {
    const savedUnreadMessages = localStorage.getItem("unreadMessages");
    return savedUnreadMessages ? JSON.parse(savedUnreadMessages) : {};
  });

  const [lastMessageTimestamps, setLastMessageTimestamps] = useState(() => {
    const savedTimestamps = localStorage.getItem("lastMessageTimestamps");
    return savedTimestamps ? JSON.parse(savedTimestamps) : {};
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    const currentUser = decoded.id;

    // Handle real-time messages
    const handleMessage = (message) => {
      if (message.receiver === currentUser) {
        // Only increment unread messages if the sender is not the currently selected user
        setUnreadMessages((prev) => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1,
        }));

        // Update the last message timestamp
        setLastMessageTimestamps((prev) => ({
          ...prev,
          [message.sender]: message.createdAt,
        }));
      }
    };

    socket.on("receiveMessage", handleMessage);

    return () => {
      socket.off("receiveMessage", handleMessage);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("unreadMessages", JSON.stringify(unreadMessages));
  }, [unreadMessages]);

  useEffect(() => {
    localStorage.setItem(
      "lastMessageTimestamps",
      JSON.stringify(lastMessageTimestamps)
    );
  }, [lastMessageTimestamps]);

  return (
    <UnreadMessagesContext.Provider
      value={{
        unreadMessages,
        setUnreadMessages,
        lastMessageTimestamps,
        setLastMessageTimestamps,
      }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};

export const useUnreadMessages = () => useContext(UnreadMessagesContext);
