const mongoose = require("mongoose");
const { GridFSBucket } = require("mongodb");

let gfsBucket;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Mongoose connection successful");

    // Initialize GridFSBucket
    const db = connection.connection.db; // Access the database directly
    gfsBucket = new GridFSBucket(db, { bucketName: "fs" }); // Use "fs" as the bucket name

    console.log("gfsBucket initialized successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

// Getter function to access gfsBucket
const getGfsBucket = () => {
  if (!gfsBucket) {
    throw new Error("GridFS bucket not initialized");
  }
  console.log("GridFS bucket accessed successfully"); // Add this log
  return gfsBucket;
};

module.exports = { connectDB, getGfsBucket };
