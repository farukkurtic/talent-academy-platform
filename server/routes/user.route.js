const express = require("express");
const { userController } = require("../controllers");
const multer = require("multer");

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.get("/id/:userID", userController.getUser);
router.get("/", userController.getUsers);
router.get("/search", userController.getUsersByName);
router.get("/filter", userController.getFilteredUsers);
router.get("/is-initialized/:userID", userController.getIsUserInitialized);
router.put("/", userController.updateUser);
router.put(
  "/:userId/details",
  upload.single("image"),
  userController.updateUserDetails
);

module.exports = router;
