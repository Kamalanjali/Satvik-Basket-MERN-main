import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";

import {
  registerUser,
  loginUser,
  getMe,
  logoutUser,
  resetPassword,
  updateMe,
} from "../controllers/auth.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/* ===============================
   GOOGLE OAUTH
================================ */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: "/login",
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: true,       // 🔥 REQUIRED
      sameSite: "none",   // 🔥 REQUIRED
      path: "/",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.redirect(process.env.CLIENT_URL);
  }
);

/* ===============================
   LOCAL AUTH
================================ */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);

/* ===============================
   SESSION
================================ */
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/logout", protect, logoutUser);

export default router;