const bcrypt = require("bcrypt");
const { Auth, User } = require("../models");
const ApiError = require("../utils/ApiError");

const loginUsingCredentials = async ({ email, password }) => {
  const authUser = await Auth.findOne({ email });
  if (!authUser) {
    throw new ApiError(404, "Korisnik nije pronađen");
  }

  const user = await User.findById(authUser._id);
  if (!user) {
    throw new ApiError(404, "Korisnik nije pronađen");
  }

  const isMatch = await authUser.isPasswordMatch(password);
  if (!isMatch) {
    throw new ApiError(400, "Pogrešni podaci za prijavu");
  }

  return user;
};

const changePassword = async ({ _id, currentPassword, newPassword }) => {
  const user = await Auth.findById(_id);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    throw new ApiError(400, "Current password is incorrect");
  }

  user.password = await bcrypt.hash(newPassword, 12);
  await user.save();

  return user;
};

module.exports = {
  loginUsingCredentials,
  changePassword,
};
