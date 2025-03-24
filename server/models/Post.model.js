const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    likes: {
      type: [String],
      default: [],
    },
    comments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    content: {
      type: String,
      required: true,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "fs.files",
      },
    ],
    gifs: [
      {
        type: String,
        default: "",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
