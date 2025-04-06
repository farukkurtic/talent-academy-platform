const { Server } = require("socket.io");
const { chatService } = require("./");
const Chat = require("../models/Chat.model");

let io;

function initializeSocket(server) {
  io = new Server(server, {
    cors: {
      origin: `${process.env.FRONT_URL}`,
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    socket.on("joinChat", (userId) => {
      socket.join(userId);
    });

    socket.on("sendMessage", async (data, callback) => {
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

        io.to(data.sender).emit("receiveMessage", newMessage);
        io.to(data.receiver).emit("receiveMessage", newMessage);

        callback(newMessage);
      } catch (error) {
        console.error("Error handling sendMessage:", error);
        callback({ error: "Failed to send message" });
      }
    });

    socket.on("disconnect", () => {});
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
