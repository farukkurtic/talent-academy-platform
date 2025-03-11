const { Server } = require("socket.io");
const { chatService } = require("./");
const Chat = require("../models/Chat.model");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    // Join user to a chat room based on userId
    socket.on("joinChat", (userId) => {
      socket.join(userId);
      console.log(`User ${userId} joined chat`);
    });

    // Handle sending messages
    socket.on("sendMessage", async (data, callback) => {
      console.log("Received sendMessage event:", data);

      if (!data.sender || !data.receiver || !data.text) {
        console.error("Invalid message data:", data);
        return callback({ error: "Invalid message data" });
      }

      try {
        const newMessage = new Chat({
          sender: data.sender,
          receiver: data.receiver,
          text: data.text,
        });
        await newMessage.save();
        console.log("Message saved to database:", newMessage);

        // Emit message to the sender and receiver if they are connected
        io.to(data.sender).emit("receiveMessage", newMessage);
        io.to(data.receiver).emit("receiveMessage", newMessage);

        callback(newMessage);
      } catch (error) {
        console.error("Error handling sendMessage:", error);
        callback({ error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });
  });

  return io;
}

function getSocketInstance() {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
}

module.exports = { initializeSocket, getSocketInstance };
