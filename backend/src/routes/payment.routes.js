import express from "express";
import { createPayment } from "../controllers/payment.controller.js";

const router = express.Router();

//Route to create a payment
router.post("/", createPayment);

export default router;
