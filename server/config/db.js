const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.AZURE_COSMOS_CONNECTIONSTRING || process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

    } catch (err) {
        console.error("Error connecting to MongoDB:", err.message);
        process.exit(1);
    }
};



module.exports = { connectDB };
