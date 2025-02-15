const { status } = require('http-status');
const { User, Auth } = require('../models');
const mongoose = require('mongoose')
const ApiError = require('../utils/ApiError');


const createUser = async (userBody) => {
    const { email, password } = userBody;

    if (await Auth.isEmailTaken(userBody.email)) {
        throw new ApiError(status.BAD_REQUEST, 'Email already taken');
    }

    const user = new Auth({ email, password });
    const defaultUser = new User(
        {
            _id: user._id,
            firstName: "",
            lastName: "",
            yearOfAttend: "",
            profession: "",
            biography: "",
            purposeOfPlatform: "",
            image: "",
            links: [],
            courseID: "",
            isInitialized: false,
          }
    )

    defaultUser.save();
    return user.save();
}

const getUserById = async (userBody) => {
    const { userID } = userBody;
    const user = User.findOne({ _id: userID })
    return user;
}

const updateUser = async (userBody) => {
    const { updatedUser } = userBody;
    const filter = { _id: updatedUser._id };
    updatedUser.isInitialized = true;
    const update = { ...updatedUser }; // Correct way to structure the update object
    const result = await User.findByIdAndUpdate(filter, update, { new: true });
    return result ?? (() => { throw new ApiError(status.BAD_REQUEST, 'No item found with the given ID.'); })();
}

const getIsUserInitialized = async (userBody) => {
    const { userID } = userBody;
    const user = User.findOne({ _id: userID })
    return user;
}

module.exports = {
    createUser,
    getUserById,
    updateUser,
    getIsUserInitialized
}