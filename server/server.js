const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");

const connectDB = require('./configs/db.js');

  
// setup Middleware//
const app = express();
app.use(cors());
app.use(express.json());


// Routes
const userRoutes = require( "./routes/userRoutes.js");
app.use('/api/user', userRoutes);
const bookmarkRoutes = require( "./routes/bookmarkRoutes.js");
app.use('/api/bookmarks', bookmarkRoutes);


// Setup and Run Server
const PORT = process.env.PORT || 3000; 
connectDB(); 
app.listen(PORT, () => console.log(`server listening on port ${PORT}`))