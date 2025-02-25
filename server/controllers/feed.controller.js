const { status } = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { feedService } = require('../services')
const { Types } = require('mongoose')

const createPost = catchAsync(async(req, res, next) => {
    try {
        console.log("Creating post...")
        const post = await feedService.createPost(req.body);

        console.log(post);
        req.postId = post._id;  // Set post ID for file upload
        //res.status(status.CREATED).json({ post });
        next();
    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to create post", err)
    }
})

const getPosts = catchAsync(async(req, res) => {
    try {   
        const posts = await feedService.getPosts(req.body)
        res.status(status.OK).json({ posts });

    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to get posts", err)
    }
})

const postReact = catchAsync(async(req, res) => {
    try {
        const postReact = await feedService.postReact(req)
        res.status(status.OK).json({ postReact: postReact })
    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to rect post", err)
    }
})

const postUnreact = catchAsync(async(req, res) => {
    try {
        const postUnreact = await feedService.postUnreact(req)
        res.status(status.OK).json({ postUnreact: postUnreact })
    } catch (err) {
        console.log("Error", err)
        res.status(status.INTERNAL_SERVER_ERROR).send("Failed to unreact post", err)
    }
})


const uploadImage = catchAsync(async(req, res) => {
  try {
      console.log("File received:", req.file);
      if (!req.file) {
          res.status(status.OK);
          //return;
      }

      const post = await feedService.uploadImage(req);
      res.status(status.OK).json(post);
  } catch (err) {
      console.error("Error in uploadImage:", err);
      res.status(status.INTERNAL_SERVER_ERROR).send("Failed to upload image");
  }
});

module.exports = { createPost, getPosts, postReact, postUnreact, uploadImage }