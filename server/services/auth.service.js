const { status } = require('http-status');
const bcrypt = require('bcrypt');
const { Auth } = require('../models');
const ApiError = require('../utils/ApiError');


const loginUsingCredentials = async (userBody) => {
    const { email, password } = userBody
    const user = await Auth.findOne({ email });
    if (!user) {
        throw new ApiError(status.NOT_FOUND, 'User not found');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(status.BAD_REQUEST, 'Invalid credentials');
    }

    return user;
}

const changePassword = async (userBody) => {
    const { _id, currentPassword, newPassword } = userBody;

    try {
        const user = await Auth.findById(_id);
        const saltRounds = 12;
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) {
            throw new ApiError(status.BAD_REQUEST, 'Current password not match');
        }

        bcrypt.hash(newPassword, saltRounds).then(async function(hash) {
            // Store hash in your password DB.
            const filter = { _id: _id };
            const update = { password: hash };

            const result = await Auth.findByIdAndUpdate(filter, update, { new: true });
            if (result) {
                return result;
              } else {
                throw new ApiError(status.BAD_REQUEST, 'No item found with the given ID.');
              }
        });

        
    } catch(error) {
        console.error("Error:", error);
        throw new ApiError(status.BAD_REQUEST, "Error updating password.");
    }
}

module.exports = {
    loginUsingCredentials,
    changePassword
}