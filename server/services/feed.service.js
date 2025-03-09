const { status } = require("http-status");
const { Post } = require("../models");
const ApiError = require("../utils/ApiError");
const { getGfsBucket } = require("../config/db");
const stream = require("stream");

const createPost = async (postBody) => {
  const { text, gif, image, userId } = postBody;

  try {
    // Create the post
    const newPost = new Post({
      userId,
      content: text,
      image: null, // Initially null, will be updated after image upload
      gif: gif || "",
      likes: [],
      comments: [],
    });

    const savedPost = await newPost.save();

    // If an image is provided, upload it to GridFS
    if (image) {
      const imageId = await uploadImageToGridFS(image, savedPost._id);
      savedPost.image = imageId; // Update the post with the image ID
      await savedPost.save();
    }

    return savedPost;
  } catch (err) {
    console.error("Error in createPost:", err);
    throw err instanceof ApiError
      ? err
      : new ApiError(500, "Došlo je do greške na serveru");
  }
};

const getPosts = async () => {
  try {
    const posts = await Post.aggregate([
      {
        $lookup: {
          from: "fs.files", // GridFS stores files here
          localField: "image", // Match post's image field
          foreignField: "_id", // Match file's ID
          as: "imageData", // Store the result in an array
        },
      },
      { $sort: { createdAt: -1 } }, // Sort posts by creation date
    ]);

    // Map posts to include image URLs
    const postsWithImages = posts.map((post) => {
      const imageUrl =
        post.imageData.length > 0
          ? `/api/image/${post.imageData[0]._id}` // Ensure this matches the route
          : null;

      return {
        ...post,
        imageUrl, // Add the image URL to the post
      };
    });

    return postsWithImages;
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

  // Create a readable stream from the file buffer
  const readableStream = new stream.Readable();
  readableStream.push(file.buffer); // Push the file buffer into the stream
  readableStream.push(null); // Signal the end of the stream

  // Create an upload stream to GridFS
  const uploadStream = gfsBucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
    metadata: { postId }, // Link the file to the post
  });

  // Pipe the readable stream to the upload stream
  readableStream.pipe(uploadStream);

  return new Promise((resolve, reject) => {
    uploadStream.on("finish", () => {
      resolve(uploadStream.id); // Return the file ID
    });

    uploadStream.on("error", (err) => {
      console.error("Error uploading file:", err);
      reject(err);
    });
  });
};

module.exports = { createPost, getPosts, postReact, postUnreact };
