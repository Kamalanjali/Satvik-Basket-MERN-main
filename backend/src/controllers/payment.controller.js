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
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    paymentId,
  } = req.body;

  // 1️⃣ Fetch order FIRST
  const order = await Order.findOne({ razorpayOrderId: razorpay_order_id });

  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }

  // 2️⃣ Prevent double verification
  if (order.paymentStatus === "PAID") {
    return res.json({ success: true });
  }

  // 3️⃣ Generate expected signature
  const body = `${razorpay_order_id}|${razorpay_payment_id}`;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  // 4️⃣ Validate signature
  if (expectedSignature !== razorpay_signature) {
    await Payment.findByIdAndUpdate(paymentId, {
      status: "FAILED_VERIFICATION",
      razorpayPaymentId: razorpay_payment_id,
    });
    return res.status(400).json({
      success: false,
      message: "Invalid Razorpay signature",
    });
  }

  // 5️⃣ Update payment record
  await Payment.findByIdAndUpdate(paymentId, {
    status: "SUCCESS",
    razorpayPaymentId: razorpay_payment_id,
    razorpaySignature: razorpay_signature,
  });

  // 6️⃣ Update order status
  order.paymentStatus = "PAID";
  await order.save();

  return res.json({ success: true });
};

