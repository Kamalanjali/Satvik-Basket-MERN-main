import express from "express";
import {
  createOrder,
  getAllOrders,
  getMyOrders,
  getLatestPendingOrder,
  getOrderById,
} from "../controllers/order.controller.js";

import {
  protect
} from "../middleware/auth.middleware.js";

import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

/* ===============================
   ADMIN: All orders
=============================== */
router.get("/", protect, adminOnly, getAllOrders);

/* ===============================
   CREATE ORDER (guest or user)
=============================== */
router.post("/", protect, createOrder);

/* ===============================
   USER: My orders
=============================== */
router.get("/my-orders", protect, getMyOrders);

/* ===============================
   USER: Latest pending order
=============================== */
router.get(
  "/cart",
  protect,
  getLatestPendingOrder
);

/* ===============================
   Get order by ID (admin or owner)
=============================== */
router.get("/:id", protect, getOrderById);   


export default router;
