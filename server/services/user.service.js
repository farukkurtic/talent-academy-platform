const { Auth, User } = require("../models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");

const getUsers = async (filter, options) => {
  try {
    const users = await User.paginate(filter, options);
    return users;
  } catch (err) {
    console.error("Error when getting users:", err);
    throw new ApiError(500, "Server error");
  }
};

const getUsersByName = async (searchQuery, options) => {
  try {
    console.log("Raw search query:", searchQuery);

    const normalizedQuery = searchQuery
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // Remove accents
      .trim(); // Remove extra spaces

    console.log("Normalized search query:", normalizedQuery);

    // Split the query into words (e.g. "Faruk Kurtic" → ["Faruk", "Kurtic"])
    const words = normalizedQuery.split(/\s+/);

    // Create a regex pattern that matches all words in either firstName or lastName
    const regexPatterns = words.map((word) => ({
      $or: [
        { firstName: { $regex: word, $options: "i" } },
        { lastName: { $regex: word, $options: "i" } },
      ],
    }));

    const filter = { $and: regexPatterns };

    console.log("MongoDB filter:", JSON.stringify(filter, null, 2));

    const users = await User.find(filter);
    console.log("Users found:", users);

    return users.length ? users : [];
  } catch (err) {
    console.error("Error when getting users:", err);
    throw new ApiError(500, "Failed to fetch users");
  }
};

const createUser = async ({ email, password }) => {
  try {
    const existingAuthUser = await Auth.findOne({ email });

    if (!existingAuthUser) {
      throw new ApiError(
        404,
        "Korisnički nalog ne postoji na talentakademija.ba"
      );
    }

    const existingUser = await User.findById(existingAuthUser._id);

    if (existingUser) {
      throw new ApiError(400, "Korisnički nalog već postoji. Prijavite se.");
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

    return newUser;
  } catch (err) {
    console.error("Greška u createUser:", err);
    throw err instanceof ApiError
      ? err
      : new ApiError(500, "Došlo je do greške na serveru");
  }
};

const getUserById = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  } catch (err) {
    console.error("Error in getUserById:", err);
    throw new ApiError(500, "Server error");
  }
};

const updateUser = async (updatedUser) => {
  try {
    const user = await User.findByIdAndUpdate(updatedUser._id, updatedUser, {
      new: true,
    });
    if (!user) {
      throw new ApiError(400, "No user found with the given ID.");
    }
    return user;
  } catch (err) {
    console.error("Error in updateUser:", err);
    throw new ApiError(500, "Server error");
  }
};

const getIsUserInitialized = async (userID) => {
  try {
    const user = await User.findById(userID);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    return user;
  } catch (err) {
    console.error("Error in getIsUserInitialized:", err);
    throw new ApiError(500, "Server error");
  }
};

const getFilteredUsers = async (filter) => {
  let query = {};

  // Filter by major (if provided, match any of the selected ones)
  if (filter.major) {
    query.major = { $in: filter.major };
  }

  // Filter by purposeOfPlatform (if provided, match any of the selected ones)
  if (filter.purposeOfPlatform) {
    query.purposeOfPlatform = { $in: filter.purposeOfPlatform };
  }

  // Filter by yearOfAttend (single value, exact match)
  if (filter.yearOfAttend) {
    query.yearOfAttend = filter.yearOfAttend;
  }

  return await User.find(query);
};

module.exports = {
  getUsers,
  getUsersByName,
  createUser,
  getUserById,
  updateUser,
  getIsUserInitialized,
  getFilteredUsers,
};
