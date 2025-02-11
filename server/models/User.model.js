const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    yearOfAttend: {
        type: Date,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    biography: {
        type: String,
        required: true
    },
    purposeOfPlatform: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    links: {
        type: Array,
        required: true
    },
    courseID: {
        type: String,
        required: true
    }
}, { timestamps: true });


module.exports = mongoose.model('User', UserSchema);
