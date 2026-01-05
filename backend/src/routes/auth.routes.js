import express from "express";
import passport from "passport";
import { protect } from "../middleware/auth.middleware.js";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  resetPassword,
  updateMe,
} from "../controllers/auth.controller.js";

import jwt from "jsonwebtoken";

const router = express.Router();

/* ===============================
   Google OAuth
================================ */

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // OAuth logins = long-lived session
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.redirect("http://localhost:5173");
  }
);

/* ===============================
   Local Auth
================================ */

router.post("/register", registerUser);
router.post("/login", loginUser);

// 🔐 SIMPLE FORGOT PASSWORD (EMAIL ONLY)
router.post("/reset-password", resetPassword);

/* ===============================
   Session
================================ */

router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/logout", protect, logoutUser);

export default router;
