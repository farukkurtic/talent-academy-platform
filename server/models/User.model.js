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
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
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
