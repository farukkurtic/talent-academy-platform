const express = require("express");
const { feedController } = require("../controllers");
const { feedService } = require("../services");
const multer = require("multer");
const { getGfsBucket } = require("../config/db");
const mongoose = require("mongoose");
const { Post } = require("../models");
const authMiddleware = require("../middlewares/authMiddleware");
const axios = require("axios");

const storage = multer.memoryStorage();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 10,
  },
});

const router = express.Router();

router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { userId, text } = req.body;
    const { postId } = req.params;

    const comment = await feedService.addComment(postId, userId, text);

    const userResponse = await axios.get(
      `http://localhost:5000/api/user/id/${userId}`
    );
    const user = userResponse.data.user;

    res.status(201).json({
      ...comment.toObject(),
      user,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.post("/:commentId/replies", authMiddleware, feedController.addReply);
router.post(
  "/comments/:commentId/like",
  authMiddleware,
  feedController.likeComment
);
router.post("/", upload.array("images"), feedController.createPost);
router.get("/", feedController.getPosts);
router.post("/:postId/like", feedController.postReact);
router.post("/:postId/unlike", feedController.postUnreact);
router.get("/image/:fileId", async (req, res) => {
  try {
    const gfsBucket = getGfsBucket();
    const fileId = new mongoose.Types.ObjectId(req.params.fileId);
    const files = await gfsBucket.find({ _id: fileId }).toArray();

    if (!files || files.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET");
    res.setHeader("Content-Type", files[0].contentType);
    res.setHeader("Content-Length", files[0].length);

    const readStream = gfsBucket.openDownloadStream(fileId);

    readStream.on("error", (err) => {
      console.error("Error streaming file:", err);
      res.status(500).json({ message: "Failed to stream file" });
    });

    readStream.pipe(res);
  } catch (err) {
    console.error("Error retrieving file:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.delete("/:postId", authMiddleware, async (req, res) => {
  try {
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
    console.error("Error in delete route:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/:postId/comment", authMiddleware, async (req, res) => {
  try {
    const { userId, text } = req.body;

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      userId,
      text,
      createdAt: new Date(),
    };
    post.comments.push(newComment);
    await post.save();

    const userResponse = await axios.get(
      `http://localhost:5000/api/user/id/${userId}`
    );
    const user = userResponse.data.user;

    res.status(201).json({
      ...newComment,
      user,
    });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:postId/comments", async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId).populate({
      path: "comments",
      populate: [
        {
          path: "userId",
          select: "firstName lastName image major",
        },
        {
          path: "replies",
          populate: {
            path: "userId",
            select: "firstName lastName image major",
          },
        },
      ],
    });

    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    const commentsWithUserDetails = post.comments.map((comment) => ({
      ...comment.toObject(),
      user: comment.userId,
      replies: comment.replies.map((reply) => ({
        ...reply.toObject(),
        user: reply.userId,
      })),
    }));

    res.status(200).json(commentsWithUserDetails);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
