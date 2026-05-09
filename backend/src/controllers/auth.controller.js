import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

/* ===============================
   Helper: issue JWT
================================ */

const issueToken = (
  userId,
  role,
  rememberMe = false
) => {
  return jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    {
      expiresIn: rememberMe ? "30d" : "1h",
    }
  );
};

/* ===============================
   Register User
================================ */

export const registerUser = asyncHandler(
  async (req, res) => {
    const {
      name,
      email,
      password,
      rememberMe = false,
    } = req.body;

    const existingUser = await User.findOne({
      email,
    });

    if (existingUser) {
      throw new AppError(
        "User already exists",
        400,
        "USER_EXISTS"
      );
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: "local",
    });

    const token = issueToken(
      user._id,
      user.role,
      rememberMe
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

/* ===============================
   Login User
================================ */

export const loginUser = asyncHandler(
  async (req, res) => {
    const {
      email,
      password,
      rememberMe = false,
    } = req.body;

    const user = await User.findOne({
      email,
    }).select("+password");

    if (!user || user.provider !== "local") {
      throw new AppError(
        "Invalid credentials",
        401,
        "INVALID_CREDENTIALS"
      );
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      throw new AppError(
        "Invalid credentials",
        401,
        "INVALID_CREDENTIALS"
      );
    }

    const token = issueToken(
      user._id,
      user.role,
      rememberMe
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  }
);

/* ===============================
   Reset Password
================================ */

export const resetPassword = asyncHandler(
  async (req, res) => {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.provider !== "local") {
      throw new AppError(
        "Password reset only for email accounts",
        400,
        "PASSWORD_RESET_NOT_ALLOWED"
      );
    }

    user.password = newPassword;

    await user.save();

    const token = issueToken(
      user._id,
      user.role,
      true
    );

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      token,
    });
  }
);

/* ===============================
   Get Logged-in User
================================ */

export const getMe = asyncHandler(
  async (req, res) => {
    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      user: req.user,
    });
  }
);

/* ===============================
   Logout
================================ */

export const logoutUser = asyncHandler(
  async (req, res) => {
    res.status(200).json({
      success: true,
      message:
        "Logged out successfully",
    });
  }
);

/* ===============================
   Update Profile
================================ */

export const updateMe = asyncHandler(
  async (req, res) => {
    const allowedUpdates = [
      "name",
      "email",
       "addresses",
       "defaultAddress",
    ];

    const updates = {};

    allowedUpdates.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      user,
    });
  }
);