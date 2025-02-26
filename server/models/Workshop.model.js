const mongoose = require('mongoose');

const WorkshopSchema = new mongoose.Schema({
    createdBy: {
        type: String,
        required: true,
    },
    name: {
        type: Array,
        required: true,
    },
    dateOfStart: {
        type: Date,
        required: true,
    },
    dateOfEnd: {
        type: Date,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    link: {
        type: String,
    },
    attendes: {
        type: Array,
    },
    hosts: {
        type: Array,
        required: true,
    },
    courseID: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    details: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Workshop', WorkshopSchema);
