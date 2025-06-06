const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { feedService } = require("../services");

const createPost = catchAsync(async (req, res) => {
  try {
    console.log("Received files:", req.files);
    console.log("Received body:", req.body);

    const { text, userId } = req.body;
    const imageFiles = req.files || [];

    let gifs = [];
    try {
      gifs = req.body.gifs ? JSON.parse(req.body.gifs) : [];
    } catch (e) {
      console.error("Error parsing GIFs:", e);
      gifs = [];
    }

    if (!text?.trim() && imageFiles.length === 0 && gifs.length === 0) {
      return res.status(400).send("Post must contain text, images, or GIFs");
    }

    const post = await feedService.createPost({
      text: text?.trim(),
      gifs,
      images: imageFiles,
      userId,
    });

    res.status(201).json({ post });
  } catch (err) {
    console.error("Error in createPost controller:", err);
    res.status(500).send(err.message || "Failed to create post");
  }
});

const getPosts = catchAsync(async (req, res) => {
  try {
    const posts = await feedService.getPosts();
    res.status(status.OK).json({ posts });
  } catch (err) {
    console.log("Error:", err);
    res.status(status.INTERNAL_SERVER_ERROR).send("Failed to fetch posts");
  }
});

const postReact = catchAsync(async (req, res) => {
  try {
    const postReact = await feedService.postReact(req);
    res.status(status.OK).json({ postReact });
  } catch (err) {
    console.log("Error:", err);
    res.status(status.INTERNAL_SERVER_ERROR).send("Failed to react to post");
  }
});

const postUnreact = catchAsync(async (req, res) => {
  try {
    const postUnreact = await feedService.postUnreact(req);
    res.status(status.OK).json({ postUnreact });
  } catch (err) {
    console.log("Error:", err);
    res.status(status.INTERNAL_SERVER_ERROR).send("Failed to unreact to post");
  }
});

const addComment = catchAsync(async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, text } = req.body;

    const comment = await feedService.addComment(postId, userId, text);
    res.status(201).json({ comment });
  } catch (err) {
    console.error("Error adding comment:", err);
    res.status(500).json({ error: "Failed to add comment" });
  }
});

const addReply = catchAsync(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId, text } = req.body;

    const reply = await feedService.addReply(commentId, userId, text);
    res.status(201).json({ reply });
  } catch (err) {
    console.error("Error adding reply:", err);
    res.status(500).json({ error: "Failed to add reply" });
  }
});

const likeComment = catchAsync(async (req, res) => {
  try {
    const { commentId } = req.params;
    const { userId } = req.body;

    const comment = await feedService.likeComment(commentId, userId);
    res.status(200).json({ comment });
  } catch (err) {
    console.error("Error liking comment:", err);
    res.status(500).json({ error: "Failed to like comment" });
  }
});

module.exports = {
  createPost,
  getPosts,
  postReact,
  postUnreact,
  addComment,
  addReply,
  likeComment,
};
