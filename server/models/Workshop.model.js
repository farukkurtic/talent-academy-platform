const mongoose = require("mongoose");

const WorkshopSchema = new mongoose.Schema(
  {
    createdBy: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    dateOfStart: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    attendes: {
      type: Array,
    },
    coverImage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "fs.files",
    },
    details: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Workshop", WorkshopSchema);
