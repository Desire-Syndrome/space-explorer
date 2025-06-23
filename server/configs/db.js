const mongoose = require('mongoose');

const connectDB = async () => {
  console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("MONGODB_URL:", process.env.MONGODB_URL);

  try {
    const MONGODB_URL = process.env.MONGODB_URL;
    
    if (process.env.NODE_ENV !== 'test') {
      await mongoose.connect(MONGODB_URL)
      console.log("DB connected");
    }
  } catch (error) {
    console.log("DB connection failed:", error);
  }
}

module.exports = connectDB;