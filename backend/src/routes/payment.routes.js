import express from "express";
import {
  createPayment,
  markPaymentSuccess,
  markPaymentFailed
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

// Create payment (user)
router.post("/", protect, createPayment);

// Update payment status (admin / webhook simulation)
router.put("/:paymentId/success", protect, adminOnly, markPaymentSuccess);
router.put("/:paymentId/fail", protect, adminOnly, markPaymentFailed);

export default router;
