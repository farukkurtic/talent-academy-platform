import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import { useUnreadMessages } from "../../contexts/UnreadMessagesContext";

import hntaLogo from "../assets/logos/hnta-logo.png";
import textLogo from "../assets/logos/textLogo.svg";
import defaultPic from "../assets/defaults/defaultPic.svg";

import kodiranje from "../assets/badges/kodiranje.svg";
import pisanje from "../assets/badges/kreativnoPisanje.svg";
import graficki from "../assets/badges/grafickiDizajn.svg";
import novinarstvo from "../assets/badges/novinarstvo.svg";
import muzika from "../assets/badges/muzickaProdukcija.svg";

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
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const {
    unreadMessages,
    setUnreadMessages,
    lastMessageTimestamps,
    setLastMessageTimestamps,
  } = useUnreadMessages();
  const navigate = useNavigate();
  const location = useLocation();

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

  useEffect(() => {
    if (location.state?.selectedUser) {
      setSelectedUser(location.state.selectedUser);
    }
  }, [location.state]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/prijava");
    const decoded = jwtDecode(token);
    setCurrentUser(decoded.id);
    socket.emit("joinChat", decoded.id);
  }, [navigate]);

  useEffect(() => {
    if (!currentUser) return;
    axios
      .get(`http://localhost:5000/api/chat/${currentUser}`)
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err));
    const fetchUnreadMessages = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/chat/unread-messages/${currentUser}`
        );
        const unreadMessagesData = response.data;
        const newUnreadMessages = {};
        const newLastMessageTimestamps = {};
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
        setUnreadMessages((prev) => ({ ...prev, ...newUnreadMessages }));
        setLastMessageTimestamps((prev) => ({
          ...prev,
          ...newLastMessageTimestamps,
        }));
      } catch (err) {
        console.error("Error fetching unread messages:", err);
      }
    };
    fetchUnreadMessages();
  }, [currentUser, setUnreadMessages, setLastMessageTimestamps]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;
    axios
      .get(
        `http://localhost:5000/api/chat/messages/${currentUser}/${selectedUser._id}`
      )
      .then((res) => {
        const validMessages = Array.isArray(res.data)
          ? res.data.filter(
              (msg) => msg && msg.sender && msg.receiver && msg.text
            )
          : [];
        setMessages(validMessages);
      })
      .catch((err) => console.error(err));
  }, [selectedUser, currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const handleMessage = (message) => {
      if (!message || !message.sender || !message.receiver || !message.text) {
        console.error("Received invalid message:", message);
        return;
      }
      if (
        !messages.some((msg) => msg._id === message._id) &&
        selectedUser &&
        (message.sender === selectedUser._id ||
          message.receiver === selectedUser._id)
      ) {
        setMessages((prev) => [...prev, message]);
      }
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
  }, [
    currentUser,
    selectedUser,
    setUnreadMessages,
    setLastMessageTimestamps,
    messages,
  ]);

  useEffect(() => {
    if (selectedUser) {
      setUnreadMessages((prev) => ({
        ...prev,
        [selectedUser._id]: 0,
      }));
      axios
        .post(`http://localhost:5000/api/chat/mark-as-read`, {
          sender: selectedUser._id,
          receiver: currentUser,
        })
        .catch((err) => console.error("Error marking messages as read:", err));
    }
  }, [selectedUser, setUnreadMessages, currentUser]);

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
        createdAt: new Date(),
      };

      socket.emit("sendMessage", messageData, (response) => {
        if (response?.error) {
          console.error("Message failed:", response.error);
        } else if (response?.message) {
          if (
            response.message.sender &&
            response.message.receiver &&
            response.message.text
          ) {
            setMessages((prev) => [...prev, response.message]);
          } else {
            console.error(
              "Received invalid message from server:",
              response.message
            );
          }
        }
      });
      setNewMessage("");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/prijava");
  };

  return (
    <div className="text-white h-screen flex flex-col lg:flex-row">
      <div className="lg:hidden fixed top-0 left-0 right-0 p-4 flex justify-between items-center border-b border-gray-700 z-50 bg-black">
        <a href="/feed" className="cursor-pointer">
          <div className="flex items-center">
            <img src={hntaLogo} alt="hnta-logo" className="w-10" />
            <img
              src={textLogo}
              alt="hnta-text-logo"
              className="w-32 h-10 ml-2"
            />
          </div>
        </a>
        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
          <Menu size={32} className="text-primary" />
        </button>
      </div>
      <div className="hidden lg:block w-85 bg-black border-r border-gray-700 p-6">
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
        <div className="text-center my-6">
          <input
            type="text"
            placeholder="Pretraži korisnike..."
            className="border p-3 rounded-full w-full text-white px-4"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
          />
          {isSearchFocused ||
            (searchQuery !== "" && (
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
                          crossOrigin="anonymous"
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
                                return (
                                  <img src={novinarstvo} className="w-4" />
                                );
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
            ))}
        </div>
        <div className="absolute bottom-10 left-20 p-6">
          <ul className="text-2xl w-full">
            <li className="flex items-center gap-x-4 py-2">
              <MessageSquare className="text-primary" size={32} />
              <a href="/chat">
                <span className="hover:text-primary cursor-pointer">Chat</span>
              </a>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <GraduationCap className="text-primary" size={32} />
              <span className="hover:text-primary cursor-pointer">
                Radionice
              </span>
            </li>
            <li className="flex items-center gap-x-4 py-2">
              <UserPen className="text-primary" size={32} />
              <a href="/moj-profil">
                <span className="hover:text-primary cursor-pointer">
                  Moj profil
                </span>
              </a>
            </li>
          </ul>
          <button
            className="bg-primary p-2 rounded-full w-3/4 mt-10 cursor-pointer"
            onClick={handleLogout}
          >
            Odjavi se
          </button>
        </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden fixed top-16 left-0 right-0 bottom-0 z-40 p-4 bg-black">
          <div className="text-center my-4">
            <input
              type="text"
              placeholder="Pretraži korisnike..."
              className="border p-3 rounded-full w-full text-white px-4"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
            {isSearchFocused ||
              (searchQuery !== "" && (
                <div className="absolute w-9/10 bg-gray-800 text-white rounded-lg shadow-2xl max-h-60 overflow-y-auto mt-5 z-50 p-3">
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
                              navigate(`/moj-profil`);
                            } else {
                              navigate(`/profil/${user._id}`);
                            }
                          }}
                        >
                          <img
                            crossOrigin="anonymous"
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
                                  return (
                                    <img src={kodiranje} className="w-4" />
                                  );
                                case "Novinarstvo":
                                  return (
                                    <img src={novinarstvo} className="w-4" />
                                  );
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
                    Prikaži sve korisnike
                  </button>
                </div>
              ))}
          </div>
          <div className="flex flex-col items-center justify-center h-full relative">
            <div className="absolute bottom-35">
              <ul className="text-2xl">
                <li className="flex items-center gap-x-4 py-2">
                  <MessageSquare className="text-primary" size={32} />
                  <a href="/chat">
                    <span className="hover:text-primary cursor-pointer">
                      Chat
                    </span>
                  </a>
                </li>
                <li className="flex items-center gap-x-4 py-2">
                  <GraduationCap className="text-primary" size={32} />
                  <span className="hover:text-primary cursor-pointer">
                    Radionice
                  </span>
                </li>
                <li className="flex items-center gap-x-4 py-2">
                  <UserPen className="text-primary" size={32} />
                  <a href="/moj-profil">
                    <span className="hover:text-primary cursor-pointer">
                      Moj profil
                    </span>
                  </a>
                </li>
              </ul>
              <button
                className="bg-primary p-2 rounded-full w-full mt-10 cursor-pointer"
                onClick={handleLogout}
              >
                Odjavi se
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="flex-1 flex flex-col lg:flex-row mt-16 lg:mt-0">
        {!selectedUser ? (
          <div className="w-full h-screen lg:w-1/4 bg-gray-800 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 tracking-wider">
              Svi korisnici
            </h2>
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
                    [user._id]: 0,
                  }));
                }}
              >
                <img
                  crossOrigin="anonymous"
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
        ) : (
          <div className="w-full lg:w-1/4 hidden lg:block bg-gray-800 p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 tracking-wider">
              Svi korisnici
            </h2>
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
                    [user._id]: 0,
                  }));
                }}
              >
                <img
                  crossOrigin="anonymous"
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
        )}
        <div className="flex-1 bg-gray-700 flex flex-col scrollbar-hide relative">
          {selectedUser ? (
            <>
              <div className="p-4 border-b border-gray-600 flex justify-between items-center sticky bg-gray-700 top-17 lg:top-0">
                <h2 className="text-xl font-bold tracking-wider">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="lg:hidden bg-primary text-white p-2 rounded-lg"
                >
                  Svi korisnici
                </button>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                {messages
                  .filter(
                    (msg) => msg && msg.sender && msg.receiver && msg.text
                  )
                  .map((msg, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        msg.sender === currentUser
                          ? "justify-end"
                          : "justify-start"
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
              <div className="sticky bottom-0 p-4 border-t border-gray-600 bg-gray-700">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
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
            <div className="hidden lg:block lg:flex lg:items-center lg:justify-center h-full">
              <p className="text-gray-400">
                Odaberite korisnika i započnite razgovor
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Chat;
