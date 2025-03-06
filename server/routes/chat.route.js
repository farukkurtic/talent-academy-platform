const express = require('express');
const { chatController } = require('../controllers')
const validate = require('../middlewares/validate')

const router = express.Router();

router.get("/:currentUserId", chatController.getChats);
router.get("/messages/:user1/:user2", chatController.getMessages);

module.exports = router;