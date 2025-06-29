const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require('./configs/db.js');

  
// setup Middleware
const app = express();
app.use(cors());
app.use(express.json());


// use files from server
const path = require("path");
app.use('/uploads', express.static(path.join(__dirname, 'data', 'uploads')));


// Routes
const userRoutes = require( "./routes/userRoutes.js");
app.use('/api/user', userRoutes);
const bookmarkRoutes = require( "./routes/bookmarkRoutes.js");
app.use('/api/bookmarks', bookmarkRoutes);
const nasaRoutes = require( "./routes/nasaRoutes.js");
app.use('/api/nasa', nasaRoutes);


// Setup and Run Server
const PORT = process.env.PORT || 3000; 
connectDB(); 
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))


// Global error handler
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message || 'Server Error',
  });
});


module.exports = app;