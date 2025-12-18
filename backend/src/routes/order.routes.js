import express from "express";
import { createOrder, getAllOrders } from "../controllers/order.controller.js";

const router = express.Router();

// Route to get all orders
router.get("/", getAllOrders);

// Route to create a new order
router.post("/", createOrder);

export default router;