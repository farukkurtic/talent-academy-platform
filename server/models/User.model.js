const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    major: { type: String, default: "" },
    yearOfAttend: { type: String, default: 2024 },
    profession: { type: String, default: "" },
    biography: { type: String, default: "" },
    purposeOfPlatform: { type: Array, default: [] },
    image: { type: String, default: "" },
    links: { type: Array, default: [] },
    courseID: { type: String, default: "" },
    isInitialized: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
