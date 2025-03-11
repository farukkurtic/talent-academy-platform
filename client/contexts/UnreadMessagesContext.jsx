import { createContext, useState, useContext } from "react";

// Create the context
const UnreadMessagesContext = createContext();

// Create a provider component
export const UnreadMessagesProvider = ({ children }) => {
  const [unreadMessages, setUnreadMessages] = useState({});

  return (
    <UnreadMessagesContext.Provider
      value={{ unreadMessages, setUnreadMessages }}
    >
      {children}
    </UnreadMessagesContext.Provider>
  );
};

// Custom hook to use the context
export const useUnreadMessages = () => useContext(UnreadMessagesContext);
