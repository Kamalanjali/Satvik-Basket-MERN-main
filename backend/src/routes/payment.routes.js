import express from "express";
import {
  createRazorpayPayment,
  verifyRazorpayPayment,
} from "../controllers/payment.controller.js";

import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * Razorpay Payment Flow
 */

// Create Razorpay order + Payment (INITIATED)
router.post(
  "/razorpay/create",
  protect,
  createRazorpayPayment
);

// Verify Razorpay payment (SUCCESS / FAILED)
router.post(
  "/razorpay/verify",
  protect,
  verifyRazorpayPayment
);

export default router;
