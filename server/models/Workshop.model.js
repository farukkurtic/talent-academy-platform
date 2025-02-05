const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const PostSchema = new mongoose.Schema({
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

UserSchema.statics.isEmailTaken = async function (email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  };

UserSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

// Hash password before saving to DB
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', UserSchema);
