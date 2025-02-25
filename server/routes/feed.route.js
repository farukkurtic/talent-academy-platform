const express = require('express');
const { feedController } = require('../controllers')
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.post('/', feedController.createPost, upload.single("image"), feedController.uploadImage);
router.get('/', feedController.getPosts);
router.post('/:postId/like', feedController.postReact);
router.post('/:postId/unlike', feedController.postUnreact);

module.exports = router;
