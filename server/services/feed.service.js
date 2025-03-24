const { status } = require("http-status");
const { Post, Comment } = require("../models");
const ApiError = require("../utils/ApiError");
const { getGfsBucket } = require("../config/db");
const stream = require("stream");

const addComment = async (postId, userId, text) => {
  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  const newComment = new Comment({
    userId,
    text,
    postId,
  });

  await newComment.save();
  post.comments.push(newComment._id);
  await post.save();

  return newComment;
};

const addReply = async (commentId, userId, text) => {
  const parentComment = await Comment.findById(commentId);
  if (!parentComment) throw new ApiError(404, "Parent comment not found");

  const newReply = new Comment({
    userId,
    text,
    postId: parentComment.postId,
    parentCommentId: commentId,
  });

  await newReply.save();
  parentComment.replies.push(newReply._id);
  await parentComment.save();

  return newReply;
};

const likeComment = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");

  if (comment.likes.includes(userId)) {
    comment.likes = comment.likes.filter((id) => id !== userId);
  } else {
    comment.likes.push(userId);
  }

  await comment.save();
  return comment;
};

const createPost = async (postBody) => {
  const { text, gifs, images, userId } = postBody;

  try {
    console.log("Creating post with:", {
      text: text?.length,
      gifs: gifs?.length,
      images: images?.length,
    });

    const newPost = new Post({
      userId,
      content: text,
      images: [],
      gifs: gifs || [],
      likes: [],
      comments: [],
    });

    const savedPost = await newPost.save();
    console.log("Post saved, ID:", savedPost._id);

    if (images?.length > 0) {
      console.log(`Uploading ${images.length} images...`);
      const uploadPromises = images.map((image, index) => {
        console.log(
          `Uploading image ${index}:`,
          image.originalname,
          image.mimetype
        );
        return uploadImageToGridFS(image, savedPost._id)
          .then((id) => {
            console.log(`Image ${index} uploaded successfully, ID:`, id);
            return id;
          })
          .catch((err) => {
            console.error(`Error uploading image ${index}:`, err);
            throw err;
          });
      });

      const imageIds = await Promise.all(uploadPromises);
      console.log("All images uploaded, IDs:", imageIds);

      savedPost.images = imageIds;
      await savedPost.save();
      console.log("Post updated with image references");
    }

    return savedPost;
  } catch (err) {
    console.error("Error in createPost service:", err);
    throw err;
  }
};

const getPosts = async () => {
  try {
    const posts = await Post.find()
      .populate({
        path: "comments",
        populate: {
          path: "userId",
          select: "firstName lastName image",
        },
      })
      .sort({ createdAt: -1 });

    return posts.map((post) => post.toObject());
  } catch (err) {
    console.error("Error in getPosts:", err);
    throw new ApiError(500, "Failed to fetch posts");
  }
};

const postReact = async (req) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  if (post.likes.includes(userId)) {
    post.likes = post.likes.filter((id) => id !== userId);
  } else {
    post.likes.push(userId);
  }

  await post.save();
  return post;
};

const postUnreact = async (req) => {
  const { postId } = req.params;
  const { userId } = req.body;

  const post = await Post.findById(postId);
  if (!post) throw new ApiError(404, "Post not found");

  post.likes = post.likes.filter((id) => id !== userId);
  await post.save();
  return post;
};

const uploadImageToGridFS = async (file, postId) => {
  const gfsBucket = getGfsBucket();

  const readableStream = new stream.Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  const uploadStream = gfsBucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
    metadata: { postId },
  });

  readableStream.pipe(uploadStream);

  return new Promise((resolve, reject) => {
    uploadStream.on("finish", () => {
      resolve(uploadStream.id);
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      reject(err);
    });
  });
};

module.exports = {
  createPost,
  getPosts,
  postReact,
  postUnreact,
  addComment,
  addReply,
  likeComment,
};
