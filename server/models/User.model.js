const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true,
        default: ""
    },
    lastName: {
        type: String,
        required: true,
        default: ""
    },
    yearOfAttend: {
        type: String,
        required: true,
    },
    profession: {
        type: String,
        required: true,
        default: ""
    },
    biography: {
        type: String,
        required: true,
        default: ""
    },
    purposeOfPlatform: {
        type: String,
        required: true,
        default: ""
    },
    image: {
        type: String,
        required: true,
        default: ""
    },
    links: {
        type: Array,
        required: true,
        default: [] // Ensures it's an empty array
    },
    courseID: {
        type: String,
        required: true,
        default: ""
    },
    isInitialized: {
        type: Boolean,
        default: false // Boolean should default to false
    }
}, { timestamps: true });

mongoose.Schema.Types.String.checkRequired(v => typeof v === 'string');

module.exports = mongoose.model('User', UserSchema);
