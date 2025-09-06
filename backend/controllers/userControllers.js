import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../config/generateToken.js";
import { Op } from "sequelize";

// @desc   Register a new user
// @route  POST /api/user
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, photo } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all mandatory fields");
  }

  // Check if user already exists
  const userExists = await User.findOne({ where: { email } });
  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  // Create user (password will be hashed automatically by hook)
  const user = await User.create({
    name,
    email,
    password,
    photo,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create user");
  }
});

// @desc   Authenticate user & get token
// @route  POST /api/user/login
// @access Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ where: { email } });

  if (user && (await user.matchPassword(password))) {
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      photo: user.photo,
      token: generateToken(user.id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password");
  }
});

// @desc   Get all users except logged-in user
// @route  GET /api/user?search=keyword
// @access Private
const allUsers = asyncHandler(async (req, res) => {
  const search = req.query.search ? req.query.search : "";

  const users = await User.findAll({
    where: {
      [Op.or]: [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ],
      id: { [Op.ne]: req.user.id }, 
    },
    attributes: { exclude: ["password"] }, 
  });

  res.json(users);
});

export { registerUser, authUser, allUsers };
