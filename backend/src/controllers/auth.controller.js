import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

/**
 * Helper: issue JWT + cookie
 */
const sendToken = (res, userId, role, rememberMe = false) => {
  const expiresIn = rememberMe ? "30d" : "1h";

  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 60 * 60 * 1000,
  });
};

/* ===============================
   Register User (Auto-login)
================================ */
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, rememberMe = false } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      provider: "local",
    });

    sendToken(res, user._id, user.role, rememberMe);

    res.status(201).json({
      success: true,
      message: "Registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   Login User
================================ */
export const loginUser = async (req, res, next) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user || user.provider !== "local") {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    sendToken(res, user._id, user.role, rememberMe);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   Forgot Password (SIMPLE v1)
================================ */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user || user.provider !== "local") {
      return res.status(400).json({
        success: false,
        message:
          "Password reset is available only for email-based accounts",
      });
    }

    // Update password (hashed by model hook)
    user.password = newPassword;
    await user.save();

    // Auto-login after reset
    sendToken(res, user._id, user.role, true);

    res.status(200).json({
      success: true,
      message: "Password reset successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   Get Logged-in User
================================ */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

/* ===============================
   Logout User
================================ */
export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};
