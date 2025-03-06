const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const pick = require("../utils/pick");
const ApiError = require("../utils/ApiError");

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
    console.log("Full request query:", req.query);

    const searchQuery = req.query.name || "";
    console.log("Received search query:", searchQuery);

    if (!searchQuery) {
      return res.status(400).json({ error: "Search query is required" });
    }

    const options = {
      limit: parseInt(req.query.limit) || 5,
      page: parseInt(req.query.page) || 1,
      sort: req.query.sortBy || "firstName",
    };

    const users = await userService.getUsersByName(searchQuery, options);
    console.log("Found users:", users);

    res.status(200).json({ users });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

const getUser = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserById(req.params.userID);
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
    console.log("Received filter query:", req.query);

    let filter = pick(req.query, [
      "major",
      "purposeOfPlatform",
      "yearOfAttend",
    ]);

    // Ensure major is treated as an array if multiple values are provided (max 5)
    if (filter.major) {
      filter.major = Array.isArray(filter.major)
        ? filter.major.slice(0, 5) // Limit to 5
        : filter.major.split(",").slice(0, 5);
    }

    // Ensure purposeOfPlatform is treated as an array if multiple values are provided (max 3)
    if (filter.purposeOfPlatform) {
      filter.purposeOfPlatform = Array.isArray(filter.purposeOfPlatform)
        ? filter.purposeOfPlatform.slice(0, 3) // Limit to 3
        : filter.purposeOfPlatform.split(",").slice(0, 3);
    }

    console.log("Picked filters:", filter);

    const users = await userService.getFilteredUsers(filter);
    console.log("Filtered users:", users);

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

    // Parse the links array if it's a JSON string
    const parsedLinks = typeof links === "string" ? JSON.parse(links) : links;

    // Update the user details
    const updatedUser = await userService.updateUserDetails(
      userId,
      { links: parsedLinks }, // Pass the parsed links array
      imageFile
    );

    res.status(200).json({ user: updatedUser });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Failed to update user details" });
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
};
