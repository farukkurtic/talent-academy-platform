const express = require('express');
const { userController } = require('../controllers')

const router = express.Router();

router.get('/id/:userID', userController.getUser);
router.get('/', userController.getUsers);
router.get('/name', userController.getUsersByName);
router.get('/is-initialized/:userID', userController.getIsUserInitialized);
router.put('/', userController.updateUser);

module.exports = router;
