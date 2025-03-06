import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const socket = io("http://localhost:5000", { transports: ["websocket"] });

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return navigate("/prijava");

    const decoded = jwtDecode(token);
    setCurrentUser(decoded.id);

    socket.emit("joinChat", decoded.id);
  }, []);

  useEffect(() => {
    if (!currentUser) return;
    axios.get(`http://localhost:5000/api/chat/${currentUser}`)
      .then(res => {
        setUsers(res.data)})
      .catch(err => console.error(err));
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser || !selectedUser) return;
  
    const handleMessage = (message) => {
      if (
        message.receiver === selectedUser._id &&
        message.sender !== currentUser
      ) {
        setMessages(prev => [...prev, message]);
      }
    };
  
    socket.on("receiveMessage", handleMessage);
  
    return () => socket.off("receiveMessage", handleMessage);
  }, [selectedUser, currentUser]);
  

  const sendMessage = () => {
    if (newMessage.trim() && selectedUser) {
      const messageData = {
        sender: currentUser,
        receiver: selectedUser._id,
        text: newMessage
      };

      socket.emit("sendMessage", messageData, (response) => {
        if (response?.error) {
          console.error("Message failed:", response.error);
        } else {
          setMessages(prev => [...prev, response]);
        }
      });

      setNewMessage("");
    }
  };

  return (
    <div className="text-white" >
      <h2>Users</h2>
      {users.map(user => (
        <button className="flex flex-col" key={user._id} onClick={() => { 
            setSelectedUser(user)
            axios.get(`http://localhost:5000/api/chat/messages/${currentUser}/${user._id}`)
            .then(res => setMessages(res.data))
            .catch(err => console.error(err));
        }}>
          {user.firstName} {user.lastName}
        </button>
      ))}

      {selectedUser && (
        <div className="text-white flex flex-col">
          <h2>Chat with {selectedUser.firstName} {selectedUser.lastName}</h2>
          <div style={{ height: "300px", overflowY: "scroll" }}>
            {messages.map((msg, index) => (
              <p key={index} style={{ textAlign: msg.sender === currentUser ? "right" : "left" }}>
                <strong>{msg.sender === currentUser ? "Me" : selectedUser.firstName}:</strong> {msg.text}
              </p>
            ))}
          </div>
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>
      )}
    </div>
  );
};

export default Chat;
