const { Auth, User } = require("../models");
const ApiError = require("../utils/ApiError");
const bcrypt = require("bcrypt");
const { getGfsBucket } = require("../config/db");
const stream = require("stream");
const mongoose = require("mongoose");

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
    const normalizedQuery = searchQuery
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    const words = normalizedQuery.split(/\s+/);

    const regexPatterns = words.map((word) => ({
      $or: [
        { firstName: { $regex: word, $options: "i" } },
        { lastName: { $regex: word, $options: "i" } },
      ],
    }));

    const filter = { $and: regexPatterns };
    const users = await User.find(filter);

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
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid user ID");
    }

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

  if (filter.major) {
    query.major = { $in: filter.major };
  }

  if (filter.purposeOfPlatform) {
    query.purposeOfPlatform = { $in: filter.purposeOfPlatform };
  }

  if (filter.yearOfAttend) {
    query.yearOfAttend = filter.yearOfAttend;
  }

  return await User.find(query);
};

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

const updateUserDetails = async (userId, data, imageFile) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (data.links) {
      user.links = data.links.map((link) => ({
        platform: link.platform,
        url: link.url,
      }));
    }

    if (imageFile) {
      const imageId = await uploadImageToGridFS(imageFile, userId);
      user.image = imageId;
    }

    await user.save();
    return user;
  } catch (err) {
    console.error("Error in updateUserDetails:", err);
    throw new ApiError(500, "Server error");
  }
};

const updateCurrentUser = async (userId, data, imageFile) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (data.links) {
      user.links = data.links.map((link) => ({
        platform: link.platform,
        url: link.url,
      }));
    }

    if (data.biography) {
      user.biography = biography;
    }

    if (data.profession) {
      user.profession = profession;
    }

    if (data.yearOfAttend) {
      user.yearOfAttend = yearOfAttend;
    }

    if (data.major) {
      user.major = major;
    }

    if (imageFile) {
      const imageId = await uploadImageToGridFS(imageFile, userId);
      user.image = imageId;
    }

    await user.save();
    return user;
  } catch (err) {
    console.error("Error in updateCurrentUser:", err);
    throw new ApiError(500, "Server error");
  }
};

module.exports = {
  getUsers,
  getUsersByName,
  createUser,
  getUserById,
  updateUser,
  getIsUserInitialized,
  getFilteredUsers,
  updateUserDetails,
  updateCurrentUser,
};
