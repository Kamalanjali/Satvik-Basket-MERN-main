import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import path from "path";

/* ===============================
   Helper: issue JWT + cookie
================================ */
const sendToken = (res, userId, role, rememberMe = false) => {
  const expiresIn = rememberMe ? "30d" : "1h";

  const token = jwt.sign(
    { userId, role },
    process.env.JWT_SECRET,
    { expiresIn }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,        // 🔥 REQUIRED
    sameSite: "none",    // 🔥 REQUIRED for Vercel ↔ Railway
    path: "/",
    domain: ".up.railway.app", // 🔥 REQUIRED for Vercel ↔ Railway
    maxAge: rememberMe
      ? 30 * 24 * 60 * 60 * 1000
      : 60 * 60 * 1000,
  });
};

/* ===============================
   Register User
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
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    sendToken(res, user._id, user.role, rememberMe);

    res.status(200).json({
      success: true,
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
   Reset Password
================================ */
export const resetPassword = async (req, res, next) => {
  try {
    const { email, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user || user.provider !== "local") {
      return res.status(400).json({
        message: "Password reset allowed only for email accounts",
      });
    }

    user.password = newPassword;
    await user.save();

    sendToken(res, user._id, user.role, true);

    res.status(200).json({ success: true });
  } catch (err) {
    next(err);
  }
};

/* ===============================
   Session
================================ */
export const getMe = async (req, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
    path: "/",
    domain: ".up.railway.app", // 🔥 REQUIRED for Vercel ↔ Railway
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

export const updateMe = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      req.body,
      { new: true, runValidators: true }
    ).select("-password");

    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
