const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    await mongoose.connect(MONGODB_URL)
    console.log("DB connected");
  } catch (error) {
    console.log("DB connection failed:", error);
  }
}

module.exports = connectDB;