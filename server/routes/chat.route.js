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
      read: false, // Fetch only unread messages
    }).populate("sender", "firstName lastName image"); // Populate sender details if needed

    res.status(200).json(unreadMessages);
  } catch (err) {
    console.error("Error fetching unread messages:", err);
    res.status(500).json({ error: "Failed to fetch unread messages" });
  }
});
router.post("/mark-as-read", async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    // Mark all unread messages from the sender to the receiver as read
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
