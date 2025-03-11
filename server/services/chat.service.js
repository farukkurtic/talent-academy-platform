const User = require("../models/User.model");
const Chat = require("../models/Chat.model");

const getAllUsers = async (currentUserId) => {
  return await User.find({ _id: { $ne: currentUserId } });
};

const getMessages = async (user1, user2) => {
  return await Chat.find({
    $or: [
      { sender: user1, receiver: user2 },
      { sender: user2, receiver: user1 },
    ],
  }).sort("createdAt");
};

module.exports = { getMessages, getAllUsers };
