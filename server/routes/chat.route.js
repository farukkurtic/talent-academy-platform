const express = require("express");
const { chatController } = require("../controllers");
const validate = require("../middlewares/validate");
const Chats = require("../models/Chat.model");

const router = express.Router();

router.get("/:currentUserId", chatController.getChats);
router.get("/messages/:user1/:user2", chatController.getMessages);
router.get("/unread-messages/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const unreadMessages = await Chats.find({
      receiver: userId,
      read: false,
    }).populate("sender", "firstName lastName image");

    res.status(200).json(unreadMessages);
  } catch (err) {
    console.error("Error fetching unread messages:", err);
    res.status(500).json({ error: "Failed to fetch unread messages" });
  }
});
router.post("/mark-as-read", async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    await Chats.updateMany(
      { sender, receiver, read: false },
      { $set: { read: true } }
    );

    res.status(200).json({ message: "Messages marked as read" });
  } catch (err) {
    console.error("Error marking messages as read:", err);
    res.status(500).json({ error: "Failed to mark messages as read" });
  }
});
module.exports = router;
