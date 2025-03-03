const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { feedService } = require("../services");

const createPost = catchAsync(async (req, res) => {
  try {
    const { text, gif, userId } = req.body;
    const imageFile = req.file;

    const post = await feedService.createPost({
      text,
      gif,
      image: imageFile,
      userId,
    });

    res.status(status.CREATED).json({ post });
  } catch (err) {
    console.log("Error:", err);
    res.status(status.INTERNAL_SERVER_ERROR).send("Failed to create post");
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

module.exports = { createPost, getPosts, postReact, postUnreact };
