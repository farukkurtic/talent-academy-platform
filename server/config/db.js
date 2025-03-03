const mongoose = require("mongoose");
const { GridFsStorage } = require("multer-gridfs-storage");
const { GridFSBucket } = require("mongodb");

let gfsBucket;

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
  });

  console.log("Mongoose connection successful");

  const db = connection.connection.db; // Access db directly
  gfsBucket = new GridFSBucket(db, { bucketName: "feed" });
  
  console.log("gfsBucket:", gfsBucket);
  console.log("gfsBucket initialized successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    process.exit(1);
  }
};

// Getter function to access gfsBucket
const getGfsBucket = () => {
  return gfsBucket;
};


module.exports = { connectDB, getGfsBucket };
