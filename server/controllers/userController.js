const AsyncHandler = require('express-async-handler');

const generateToken = require('../middleware/tokenGenerate');

const { saveUploadedFile, deleteUploadedFile } = require('../middleware/multer.js');

const User = require("../models/User.js");


const userRegistration = AsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Missing details." });
  }

  const existUser = await User.findOne({ email });
  if (existUser) {
    return res.status(400).json({ message: "User already exists." });
  }

  if (password.length < 6) {
    return res.status(400).json({ message: "Password must be at least 6 characters long." });
  }
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message: "Password must contain at least one uppercase letter and one number."
    });
  }

  let avatarPath = null;
  if (req.files?.avatar && req.files.avatar.length > 0) {
    avatarPath = await saveUploadedFile(req.files.avatar[0], "avatar");
  }

  const user = await User.create({
    name, email, password,
    image: avatarPath
  });
  return res.status(201).json({
    message: "User created.",
    _id: user._id,
    name: user.name,
    email: user.email,
    token: null,
    image: user.image || null
  });
});


const userLogin = AsyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return res.status(200).json({
      message: "User is logged in.",
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
      image: user.image || null
    })
  } else {
    return res.status(401).json({ message: "Invalid Email or Password." });
  }
});


const updateUser = AsyncHandler(async (req, res) => {
  const { name, email, oldPassword, newPassword } = req.body;
  const user = await User.findById(req.account._id);

  if (user) {
    user.name = name || user.name;
    user.email = email || user.email;
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ message: "Please provide old password." });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ message: "Password must be at least 6 characters long." });
      }
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d).+$/;
      if (!passwordRegex.test(newPassword)) {
        return res.status(400).json({
          message: "Password must contain at least one uppercase letter and one number."
        });
      }
      const isMatch = await user.matchPassword(oldPassword);
      if (!isMatch) {
        return res.status(401).json({ message: "Old password is incorrect." });
      }
      user.password = newPassword;
    }

    if (req.files?.avatar && req.files.avatar.length > 0) {
      if (user.image) {
        await deleteUploadedFile(user.image);
      }
      const avatarPath = await saveUploadedFile(req.files.avatar[0], "avatar");
      user.image = avatarPath;
    }

    const updatedUser = await user.save();
    return res.status(200).json({
      message: "User profile updated.",
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      token: generateToken(updatedUser._id),
      image: updatedUser.image || null
    });
  } else {
    return res.status(404).json({ message: "User not found." });
  }
});


const deleteUser = AsyncHandler(async (req, res) => {
  const user = await User.findById(req.account._id);

  if (user) {
    if (user.image) { await deleteUploadedFile(user.image); }
    await user.deleteOne();
    return res.status(200).json({
      message: "User profile deleted."
    });
  } else {
    return res.status(404).json({ message: "User not found." });
  }
});


module.exports = { userRegistration, userLogin, updateUser, deleteUser };