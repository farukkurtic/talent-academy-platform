const { Auth, User } = require("../models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");

const createUser = async ({ email, password }) => {
  try {
    const existingAuthUser = await Auth.findOne({ email });

    if (!existingAuthUser) {
      throw new ApiError(
        404,
        "Korisnički nalog ne postoji na talentakademija.ba"
      );
    }

    const existingUser = await User.findById(existingAuthUser?._id);

    if (existingUser) {
      throw new ApiError(400, "Korisnički nalog već postoji. Prijavite se");
    }

    const isMatch = await bcrypt.compare(password, existingAuthUser.password);
    if (!isMatch) {
      throw new ApiError(401, "Pogrešni podaci za prijavu");
    }

    const newUser = new User({
      _id: existingAuthUser._id,
      firstName: "",
      lastName: "",
      major: "",
      yearOfAttend: "",
      profession: "",
      biography: "",
      purposeOfPlatform: [],
      image: "",
      links: [],
      courseID: "",
      isInitialized: true,
    });
    await newUser.save();

    // 🔥 Return the new user object with _id
    return newUser;
  } catch (err) {
    console.error("Greška u createUser:", err);
    throw err instanceof ApiError
      ? err
      : new ApiError(500, "Došlo je do greške na serveru");
  }
};

const getUserById = async (userId) => {
  console.log(userId)
  const user = await User.findById(userId.userID);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const updateUser = async (updatedUser) => {
  // ovooooooooooooooooooooooooooooooooooooooooooooooooooooooooooooo
  // updatedUser.isInitialized = true;
  const user = await User.findByIdAndUpdate(updatedUser._id, updatedUser, {
    new: true,
  });
  if (!user) {
    throw new ApiError(400, "No user found with the given ID.");
  }
  return user;
};

const getIsUserInitialized = async (userID) => {
  const user = await User.findById(userID);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user.isInitialized;
};

module.exports = {
  createUser,
  getUserById,
  updateUser,
  getIsUserInitialized,
};
