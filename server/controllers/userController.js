import jwt from "jsonwebtoken";
import User from "../models/User.js";
import cloudinary from "../config/cloudinary.js";
import { generateToken } from "../utils/generateToken.js";

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, avatar } = req.body;

    const exist = await User.findOne({ email });
    if (exist) return res.status(400).json({ message: "User already exists" });

    let avatarUrl = "";

    if (avatar) {
      const upload = await cloudinary.uploader.upload(avatar, {
        folder: "foodey/users",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });
      avatarUrl = upload.secure_url;
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      address,
      avatar: avatarUrl,
    });

    generateToken(res, user._id, user.role);

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    generateToken(res, user._id, user.role);

    res.json({ message: "Login successful", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.clearCookie("jwt");
  res.json({ message: "Logged out successfully" });
};

// Get User Profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update User Profile
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, phone, address, avatar } = req.body;

    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    if (avatar && avatar !== user.avatar) {
      // If old avatar exists in Cloudinary, try to delete it
      if (user.avatar) {
        const publicId = user.avatar.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`foodey/users/${publicId}`);
      }

      // Upload new one
      const upload = await cloudinary.uploader.upload(avatar, {
        folder: "foodey/users",
        transformation: [{ width: 300, height: 300, crop: "fill" }],
      });

      user.avatar = upload.secure_url;
    }

    await user.save();

    res.json({ message: "Profile updated", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Auth Middleware
export const authUser = (req, res, next) => {
  const token = req.cookies.jwt || req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.userId = decoded.id;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ message: "Token is not valid" });
  }
};
