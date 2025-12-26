import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import razorpayInstance from "../config/razorpay.js";

/**
 * Create Razorpay Order + Payment (INITIATED)
 */
export const createRazorpayPayment = async (req, res) => {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.orderStatus !== "CREATED") {
      return res.status(400).json({
        success: false,
        message: "Order is not eligible for payment",
      });
    }

    // Always trust DB, never client
    const amount = order.totalAmount;

    const razorpayOrder = await razorpayInstance.orders.create({
      amount: amount * 100,
      currency: "INR",
      receipt: `order_${order._id}`,
    });

    const payment = await Payment.create({
      orderId: order._id,
      amount,
      provider: "RAZORPAY",
      providerOrderId: razorpayOrder.id,
      status: "INITIATED",
    });

    res.status(201).json({
      success: true,
      razorpayOrder,
      paymentId: payment._id,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay payment",
      error: error.message,
    });
  }
};

/**
 * Verify Razorpay Payment (FINAL STEP)
 */
export const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      paymentId,
    } = req.body;

    // 1️⃣ Verify signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid Razorpay signature" });
    }

    // 2️⃣ Fetch payment
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    // 3️⃣ Prevent double processing
    if (payment.status === "SUCCESS") {
      return res.json({ success: true });
    }

    // 4️⃣ Update payment
    payment.status = "SUCCESS";
    payment.razorpayPaymentId = razorpay_payment_id;
    payment.razorpaySignature = razorpay_signature;
    await payment.save();

    // 5️⃣ Update order (THIS IS THE MISSING PIECE)
    await Order.findByIdAndUpdate(payment.orderId, {
      paymentStatus: "PAID",
      orderStatus: "CONFIRMED",
    });

    return res.json({ success: true });
  } catch (error) {
    console.error("Razorpay verification error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
};
