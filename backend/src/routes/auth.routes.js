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
   GOOGLE OAUTH (TOKEN FLOW)
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
    failureRedirect: `${process.env.CLIENT_URL}/login`,
  }),
  (req, res) => {
    const token = jwt.sign(
      { userId: req.user._id, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.redirect(
      `${process.env.CLIENT_URL}/oauth-success?token=${token}`
    );
  }
);

/* ===============================
   LOCAL AUTH
================================ */
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/reset-password", resetPassword);

/* ===============================
   SESSION (PROTECTED)
================================ */
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.post("/logout", protect, logoutUser);

export default router;