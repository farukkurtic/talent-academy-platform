const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PostSchema = new mongoose.Schema({
    userId: {
        type: String,
    },
    likes: {
        type: Array,
    },
    comments: {
        type: Array,
    },
    content: {
        type: String,
    },
    image: {
        type: String, 
        ref: "feed.files" 
    },
    gif: {
        type: String,
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
