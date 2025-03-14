const express = require("express");
const { feedController } = require("../controllers");
const multer = require("multer");
const { getGfsBucket } = require("../config/db");
const mongoose = require("mongoose");
const { Post } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const axios = require("axios");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post(
  "/",
  upload.single("image"), // Handle file upload
  feedController.createPost // Create the post
);

// Get all posts
router.get("/", feedController.getPosts);

// Like a post
router.post("/:postId/like", feedController.postReact);

// Unlike a post
router.post("/:postId/unlike", feedController.postUnreact);

router.get("/image/:fileId", async (req, res) => {
  try {
    console.log("Request received for fileId:", req.params.fileId);

    const gfsBucket = getGfsBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);

    console.log("Converted fileId:", fileId);

    // Find file metadata in GridFS
    const files = await gfsBucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      console.log("File not found in GridFS for fileId:", fileId);
      return res.status(404).json({ message: "File not found" });
    }

    console.log("File found in GridFS:", files[0]);

    // Set proper headers before streaming the file
    res.setHeader("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.setHeader("Access-Control-Allow-Methods", "GET"); // Allow only GET requests
    res.setHeader("Content-Type", files[0].contentType);
    res.setHeader("Content-Length", files[0].length);

    // Open download stream
    const readStream = gfsBucket.openDownloadStream(fileId);

    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ message: "Failed to stream file" });
    });

    readStream.on("end", () => {
      console.log("File streaming completed");
    });

    // Pipe stream to response
    readStream.pipe(res);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
    console.log("Received delete request for post ID:", req.params.postId); // Debugging
    console.log("User ID from token:", req.user.id); // Debugging

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Not authorized" });
    }

    await Post.findByIdAndDelete(req.params.postId);
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error in delete route:", err); // Debugging
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { userId, text } = req.body;

    // Find the post
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Add the comment
    const newComment = {
      userId,
      text,
      createdAt: new Date(),
    };
    post.comments.push(newComment);
    await post.save();

    // Fetch the user who posted the comment
    const userResponse = await axios.get(
      `http://localhost:5000/api/user/id/${userId}`
    );
    const user = userResponse.data.user;

    // Return the comment with user details
    res.status(201).json({
      ...newComment,
      user, // Include user details
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Fetch comments for a post
router.get("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    // Fetch user details for each comment
    const commentsWithUserDetails = await Promise.all(
      post.comments.map(async (comment) => {
        const userResponse = await axios.get(
          `http://localhost:5000/api/user/id/${comment.userId}`
        );
        const user = userResponse.data.user;

        return {
          ...comment.toObject(),
          user, // Attach user details
        };
      })
    );

    res.status(200).json(commentsWithUserDetails);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
