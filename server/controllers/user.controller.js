const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");
const { User } = require("../models");
const { getGfsBucket } = require("../config/db");
const stream = require("stream");

const getUsers = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, [
      "firstName",
      "lastName",
      "yearOfAttend",
      "major",
      "purposeOfPlatform",
    ]);
    const options = pick(req.query, ["sortBy", "limit", "page"]);

    const users = await userService.getUsers(filter, options);
    res.status(status.OK).json({ users });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get users" });
  }
});

const getUsersByName = catchAsync(async (req, res) => {
  try {
    const searchQuery = req.query.name || "";

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const options = {
      limit: parseInt(req.query.limit) || 5,
      page: parseInt(req.query.page) || 1,
      sort: req.query.sortBy || "firstName",
    };

    const users = await userService.getUsersByName(searchQuery, options);

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const getUser = catchAsync(async (req, res) => {
  try {
    const { userID } = req.params;

    const user = await userService.getUserById(userID);
    res.status(status.OK).json({ user });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get user" });
  }
});

const updateUser = catchAsync(async (req, res) => {
  try {
    const user = await userService.updateUser(req.body);
    res.status(status.OK).json({ user });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to update user" });
  }
});

const getIsUserInitialized = catchAsync(async (req, res) => {
  try {
    const user = await userService.getIsUserInitialized(req.params.userID);
    res.status(status.OK).json({ isInitialized: user.isInitialized });
  } catch (err) {
    console.error("Error:", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .json({ error: "Failed to get user initialization status" });
  }
});

const getFilteredUsers = catchAsync(async (req, res) => {
  try {
    let filter = pick(req.query, [
      "major",
      "purposeOfPlatform",
      "yearOfAttend",
    ]);

    if (filter.major) {
      filter.major = Array.isArray(filter.major)
        ? filter.major.slice(0, 5)
        : filter.major.split(",").slice(0, 5);
    }

    if (filter.purposeOfPlatform) {
      filter.purposeOfPlatform = Array.isArray(filter.purposeOfPlatform)
        ? filter.purposeOfPlatform.slice(0, 3)
        : filter.purposeOfPlatform.split(",").slice(0, 3);
    }

    const users = await userService.getFilteredUsers(filter);

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error filtering users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

const updateUserDetails = catchAsync(async (req, res) => {
  try {
    const { userId } = req.params;
    const { links } = req.body;
    const imageFile = req.file;

    const parsedLinks = typeof links === "string" ? JSON.parse(links) : links;

    const updatedUser = await userService.updateUserDetails(
      userId,
      { links: parsedLinks },
      imageFile
    );

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update user details" });
  }
});

const uploadImageToGridFS = async (file, userId) => {
  const gfsBucket = getGfsBucket();

  const readableStream = new stream.Readable();
  readableStream.push(file.buffer);
  readableStream.push(null);

  const uploadStream = gfsBucket.openUploadStream(file.originalname, {
    contentType: file.mimetype,
    metadata: { userId },
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

const updateCurrentUser = catchAsync(async (req, res) => {
  try {
    const { userId } = req.params;
    const {
      major,
      yearOfAttend,
      profession,
      biography,
      links,
      purposeOfPlatform,
    } = req.body;
    const imageFile = req.file;

    const parsedLinks = typeof links === "string" ? JSON.parse(links) : links;

    const parsedPurposeOfPlatform =
      typeof purposeOfPlatform === "string"
        ? JSON.parse(purposeOfPlatform)
        : purposeOfPlatform;

    const updateData = {
      purposeOfPlatform: parsedPurposeOfPlatform,
      major,
      yearOfAttend,
      profession,
      biography,
      links: parsedLinks,
    };

    if (imageFile) {
      const imageId = await uploadImageToGridFS(imageFile, userId);
      updateData.image = imageId;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    });

    if (!updatedUser) {
      throw new ApiError(404, "User not found");
    }

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Error updating current user:", err);
    res.status(500).json({ error: "Failed to update current user" });
  }
});

module.exports = {
  getUsers,
  getUsersByName,
  getUser,
  updateUser,
  getIsUserInitialized,
  getFilteredUsers,
  updateUserDetails,
  updateCurrentUser,
};
