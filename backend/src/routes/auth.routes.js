import express from "express";
import {
  registerUser,
  loginUser,
  getMe,
  logoutUser
} from "../controllers/auth.controller.js";


const router = express.Router();

// POST /api/v1/auth/register
router.post("/register", registerUser);

// POST /api/v1/auth/login
router.post("/login", loginUser);

// GET /api/v1/auth/me
router.get("/me", getMe);

// POST /api/v1/auth/logout
router.post("/logout", logoutUser);

export default router;
