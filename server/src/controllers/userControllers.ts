import * as asyncHandler from "express-async-handler"
import User from "../models/userModel";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { secretKey } from '../config';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || secretKey, {
    expiresIn: "24h",
  });
};

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = asyncHandler(async (req, res) => {

  const users = await User.find({});
  res.send(users);
});

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = asyncHandler(async (req, res) => {
  console.log('registerUser called');
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ message: "Please Enter all the Feilds" });
    return;
  }

  const userExists = await User.findOne({ username });

  if (userExists) {
    res.status(400).json({ message: "User already exists, please login" });
    return;
  }

  const user = await User.create({
    username,
    password,
  });

  if (user) {
    res.status(201).json({
      id: user.id,
      username: user.username,
    });
  } else {
    res.status(400).json({message: "User not found"});
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const loginUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401).json({ message: 'Invalid username or password' });
    return;
  }

  res.json({
    id: user.id,
    username: user.username,
    token: generateToken(user.id),
  });
});

export { allUsers, registerUser, loginUser };