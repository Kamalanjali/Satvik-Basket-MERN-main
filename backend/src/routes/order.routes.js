import express from "express";
import { createOrder, getAllOrders, getMyOrders } from "../controllers/order.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();

// Route to get all orders
router.get("/", protect, adminOnly, getAllOrders);

// Route to create a new order
router.post("/", protect, createOrder);

// Route to get the USER's past Orders
router.get("/my-orders", protect, getMyOrders);

export default router;