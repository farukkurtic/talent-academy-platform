const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gfsBucket;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI);

    const db = connection.connection.db;
    gfsBucket = new GridFSBucket(db, { bucketName: "fs" });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFS bucket not initialized");
  }
  return gfsBucket;
};

module.exports = { connectDB, getGfsBucket };
