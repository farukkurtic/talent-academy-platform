const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    comments: [
      {
        userId: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    content: {
      type: String,
      required: true,
    },
    image: {
      type: mongoose.Schema.Types.ObjectId, // Reference to GridFS file
      ref: "fs.files", // GridFS collection
    },
    gif: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
