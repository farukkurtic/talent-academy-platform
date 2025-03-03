const { status } = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { userService } = require("../services");
const pick = require('../utils/pick') 

const getUsers = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['firstName', 'lastName', 'yearOfAttend', 'major', 'purposeOfPlatform']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const users = await userService.getUsers(filter, options);

    res.status(status.OK).json({ users });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get users", err);
  }
});

const getUsersByName = catchAsync(async (req, res) => {
  try {
    const filter = pick(req.query, ['firstName', 'lastName']);
    const options = pick(req.query, ['sortBy', 'limit', 'page']);

    const users = await userService.getUsersByName(filter, options);
    console.log(users)
    res.status(status.OK).json({ users: users.results.splice(0, 5) });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get users by name", err);
  }
});

const getUser = catchAsync(async (req, res) => {
  try {
    const user = await userService.getUserById(req.params);
    res.status(status.OK).json({ user });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get user", err);
  }
});

const updateUser = catchAsync(async (req, res) => {
  try {
    const user = await userService.updateUser(req.body);
    res.status(status.OK).json({ user });
  } catch (err) {
    console.log("Error", err);
    res.status(status.INTERNAL_SERVER_ERROR).send("Failed to update user", err);
  }
});

const getIsUserInitialized = catchAsync(async (req, res) => {
  try {
    console.log(req.params.userID);
    const user = await userService.getIsUserInitialized(req.params);
    res.status(status.OK).json({ isInitialized: user.isInitialized });
  } catch (err) {
    console.log("Error", err);
    res
      .status(status.INTERNAL_SERVER_ERROR)
      .send("Failed to get is user initialized", err);
  }
});

module.exports = { getUsers, getUsersByName, getUser, updateUser, getIsUserInitialized };
