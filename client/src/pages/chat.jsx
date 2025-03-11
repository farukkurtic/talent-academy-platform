import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useUnreadMessages } from "../../contexts/UnreadMessagesContext";

import hntaLogo from "../assets/hnta-logo.png";
import textLogo from "../assets/textLogo.svg";
import defaultPic from "../assets/default-image.png";

import kodiranje from "../assets/kodiranje.svg";
import pisanje from "../assets/kreativnoPisanje.svg";
import graficki from "../assets/grafickiDizajn.svg";
import novinarstvo from "../assets/novinarstvo.svg";
import muzika from "../assets/muzickaProdukcija.svg";

import { MessageSquare, GraduationCap, UserPen, Menu } from "lucide-react";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {
    unreadMessages,
    setUnreadMessages,
    lastMessageTimestamps,
    setLastMessageTimestamps,
  } = useUnreadMessages();

  const handleSearch = async (query) => {
    setSearchQuery(query);

    if (query.length > 1) {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/user/search?name=${query}`
        );
        setSearchResults(response.data.users);
      } catch (err) {
        console.error("Error searching users:", err);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/prijava");

    const decoded = jwtDecode(token);
    setCurrentUser(decoded.id);
    socket.emit("joinChat", decoded.id);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;

    // Fetch all users
    axios
      .get(`http://localhost:5000/api/chat/${currentUser}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));

    // Fetch unread messages
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/unread-messages/${currentUser}`
        );
        const unreadMessagesData = response.data;

        const newUnreadMessages = { ...unreadMessages };
        const newLastMessageTimestamps = { ...lastMessageTimestamps };

        unreadMessagesData.forEach((message) => {
          newUnreadMessages[message.sender._id] =
            (newUnreadMessages[message.sender._id] || 0) + 1;

          if (
            !newLastMessageTimestamps[message.sender._id] ||
            new Date(message.createdAt) >
              new Date(newLastMessageTimestamps[message.sender._id])
          ) {
            newLastMessageTimestamps[message.sender._id] = message.createdAt;
          }
        });

        setUnreadMessages(newUnreadMessages);
        setLastMessageTimestamps(newLastMessageTimestamps);
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    };

    fetchUnreadMessages();
  }, [currentUser, setUnreadMessages, setLastMessageTimestamps]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    // Fetch past messages for the selected user
    axios
      .get(
        `http://localhost:5000/api/chat/messages/${currentUser}/${selectedUser._id}`
      )
      .then((res) => setMessages(res.data))
      .catch((err) => console.error(err));
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!currentUser) return;

    const handleMessage = (message) => {
      // If the message is for the currently selected user, add it to the messages list
      if (
        selectedUser &&
        (message.sender === selectedUser._id ||
          message.receiver === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }

      // Update unread messages if the message is not from the selected user
      if (
        message.receiver === currentUser &&
        message.sender !== selectedUser?._id
      ) {
        setUnreadMessages((prev) => ({
          ...prev,
          [message.sender]: (prev[message.sender] || 0) + 1,
        }));

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
  }, [currentUser, selectedUser, setUnreadMessages, setLastMessageTimestamps]);

  // Reset unread messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0, // Reset unread messages for this user
      }));

      // Mark messages as read on the server
      axios
        .post(`http://localhost:5000/api/chat/mark-as-read`, {
          sender: selectedUser._id,
          receiver: currentUser,
        })
        .catch((err) => console.error("Error marking messages as read:", err));
    }
  }, [selectedUser, setUnreadMessages, currentUser]);

  // Sort users by last message timestamp
  const sortedUsers = users.sort((a, b) => {
    const timestampA = lastMessageTimestamps[a._id] || 0;
    const timestampB = lastMessageTimestamps[b._id] || 0;
    return new Date(timestampB) - new Date(timestampA);
  });

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        sender: currentUser,
        receiver: selectedUser._id,
        text: newMessage,
        createdAt: new Date(), // Add a timestamp for the message
      };

      // Update local state immediately
      setMessages((prev) => [...prev, messageData]);

      // Emit the message via the socket
      socket.emit("sendMessage", messageData, (response) => {
        if (response?.error) {
          console.error("Message failed:", response.error);
        }
      });

      setNewMessage("");
    }
  };

  return (
    <div className="text-white h-screen flex">
      {/* Sidebar (Desktop Only) */}
      <div className="hidden lg:block w-1/5 bg-black border-r border-gray-700 p-6">
        {/* Logo Section */}
        <a href="/feed" className="cursor-pointer">
          <div className="logo-container flex items-center justify-center">
            <img src={hntaLogo} alt="hnta-logo" className="w-20" />
            <img
              src={textLogo}
              alt="hnta-text-logo"
              className="w-40 h-40 ml-2"
            />
          </div>
        </a>

        {/* Search Bar */}
        <div className="text-center my-6">
          <input
            type="text"
            placeholder="Pretraži korisnike..."
            className="border p-3 rounded-full w-full text-white px-4 bg-gray-800"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
          {searchQuery !== "" && (
            <div className="absolute w-5/6 bg-gray-800 text-white rounded-2xl shadow-lg max-h-60 overflow-y-auto mt-5 z-50 p-3">
              {searchResults.length === 0 ? (
                <div>Korisnik nije pronađen</div>
              ) : (
                <div>
                  {searchResults.map((user) => (
                    <div
                      key={user._id}
                      className="p-2 hover:bg-gray-700 cursor-pointer flex items-center gap-2 mb-0 border-bottom border-gray-700"
                      onClick={() => {
                        if (currentUser === user?._id) {
                          navigate("/moj-profil");
                        } else {
                          navigate(`/profil/${user._id}`);
                        }
                      }}
                    >
                      <img
                        src={
                          user?.image
                            ? `http://localhost:5000/api/posts/image/${user?.image}`
                            : defaultPic
                        }
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-10 h-10 rounded-full"
                      />
                      <span>
                        {user.firstName} {user.lastName}
                      </span>
                      <span>
                        {(() => {
                          switch (user.major) {
                            case "Muzička produkcija":
                              return <img src={muzika} className="w-4" />;
                            case "Odgovorno kodiranje":
                              return <img src={kodiranje} className="w-4" />;
                            case "Novinarstvo":
                              return <img src={novinarstvo} className="w-4" />;
                            case "Kreativno pisanje":
                              return <img src={pisanje} className="w-4" />;
                            case "Grafički dizajn":
                              return <img src={graficki} className="w-4" />;
                          }
                        })()}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button className="w-5/6 rounded-full bg-primary text-white tracking-wider cursor-pointer p-3 mt-5">
                <a href="/svi-korisnici">Prikaži sve korisnike</a>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Links and Logout Button at the Bottom */}
        <div className="absolute bottom-10 left-20 p-6">
          <ul className="text-2xl w-full">
            <li className="flex items-center gap-x-4 py-2">
              <MessageSquare className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">Chat</span>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <GraduationCap className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">
                Radionice
              </span>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <UserPen className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">
                Moj profil
              </span>
            </li>
          </ul>
          <button className="bg-primary p-2 rounded-full w-3/4 mt-10 cursor-pointer">
            Odjavi se
          </button>
        </div>
      </div>

      {/* List of Users */}
      <div className="w-1/5 bg-gray-800 p-4 overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 tracking-wider">Svi korisnici</h2>
        {sortedUsers.map((user) => (
          <div
            key={user._id}
            className={`flex items-center gap-3 p-2 hover:bg-gray-700 cursor-pointer rounded-lg ${
              selectedUser?._id === user._id ? "bg-gray-600" : ""
            }`}
            onClick={() => {
              setSelectedUser(user);
              setUnreadMessages((prev) => ({
                ...prev,
                [user._id]: 0, // Reset unread messages for this user
              }));
            }}
          >
            <img
              src={
                user?.image
                  ? `http://localhost:5000/api/posts/image/${user?.image}`
                  : defaultPic
              }
              alt={`${user.firstName} ${user.lastName}`}
              className="w-10 h-10 rounded-full"
            />
            <span>
              {user.firstName} {user.lastName}
            </span>
            {unreadMessages[user._id] > 0 && (
              <span className="bg-primary text-white text-xs rounded-full px-2 py-1">
                {unreadMessages[user._id]}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Chat Window */}
      <div className="flex-1 bg-gray-700 flex flex-col">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-600">
              <h2 className="text-xl font-bold tracking-wider">
                {selectedUser.firstName} {selectedUser.lastName}
              </h2>
            </div>
            <div className="flex-1 p-4 overflow-y-auto">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === currentUser ? "justify-end" : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-2/3 p-3 rounded-lg ${
                      msg.sender === currentUser
                        ? "bg-primary text-white"
                        : "bg-gray-600 text-white"
                    }`}
                  >
                    <p>{msg.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-gray-600">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default behavior (e.g., new line)
                      sendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  className="flex-1 p-2 rounded-lg bg-gray-800 text-white"
                />
                <button
                  onClick={sendMessage}
                  className="bg-primary text-white p-2 rounded-lg"
                >
                  Send
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-400">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
