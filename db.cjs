const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("YOUR_CONNECTION_STRING", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.log("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;