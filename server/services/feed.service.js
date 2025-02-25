const { status } = require('http-status');
const { Post } = require('../models');
const ApiError = require('../utils/ApiError');
const { getGfsBucket } = require("../config/db");
const { Readable } = require("stream");
const fs = require("fs");

const createPost = async (postBody) => {
    const { text, userId } = postBody;

    try {
        console.log("test", postBody)
        let newPost;
        newPost = new Post({ userId: "userId", content: "text", image: '', gif: '', likes: [], comments: [] });

        return await newPost.save();

      } catch (err) {
        console.error("Greška u createPost:", err);
        throw err instanceof ApiError
          ? err
          : new ApiError(500, "Došlo je do greške na serveru");
      }
}

const getPosts = async () => {
  const posts = await Post.aggregate([
    {
      $lookup: {
        from: "feed.files", // GridFS stores files here
        localField: "_id", // Match post's ID
        foreignField: "metadata.postId", // Match file's postId
        as: "feed" // Store the result in an array
      }
    },
    { $sort: { createdAt: -1 } } // Sort posts by creation date
  ]);

  const postsWithImages = posts.map((post) => {
    // Get the first image if exists
    const image = post.feed.length > 0 ? `/image/${post.feed[0]._id}` : null;

    return {
      userId: post?.userId,
      content: post?.content,
      image: image
    };
  });

  return postsWithImages;
};

const postReact = async (req) => {
  const { postId } = req.params;
  const { userId } = req.body; 

  const post = await Post.findById(postId);
  if (!post) return new ApiError(status.INTERNAL_SERVER_ERROR, "Došlo je do greške na serveru");
 
  if(post.likes.includes(userId)) post.likes = post.likes.filter((r) => r !== userId);
  else post.likes.push(userId);

  return await post.save();
}

const postComment = async (req) => {
  const { postId } = req.params;
  const { userId, text } = req.body;

  const post = await Post.findById(postId);
  if (!post) return new ApiError(status.INTERNAL_SERVER_ERROR, "Došlo je do greške na serveru");

  post.comments.push({ userId: userId, content: text })
  return await post.save();
}

const uploadImage = async (req) => {
  const { file } = req;
  console.log("upload", req.postId)
  const gfsBucket = await getGfsBucket();

    // Prepare readable stream
    if(file) {
      const readableStream = new Readable();
      readableStream.push(file.buffer);
      readableStream.push(null);
  
      // Upload to GridFS
      const uploadStream = gfsBucket.openUploadStream(file.originalname, {
          contentType: file.mimetype,
          metadata: { postId: req.postId}
      });
  
      readableStream.pipe(uploadStream);
  
      return new Promise((resolve, reject) => {
          uploadStream.on("finish", async () => {
              try {
                  const tempFilePath = `./temp_${file.originalname}`;
  
                  // Save uploaded file locally
                  const downloadStream = gfsBucket.openDownloadStream(uploadStream.id);
                  const writeStream = fs.createWriteStream(tempFilePath);
                  downloadStream.pipe(writeStream);
                  await new Promise((res, rej) => {
                      writeStream.on("finish", res);
                      writeStream.on("error", rej);
                  });
  
                  resolve();
              } catch (err) {
                  console.error("Error during upload and transcription:", err);
                  reject(err);
              }
          });
  
          uploadStream.on("error", reject);
      });
    }
  }



module.exports = {
  createPost,
  getPosts,
  postReact,
  postComment,
  uploadImage
}