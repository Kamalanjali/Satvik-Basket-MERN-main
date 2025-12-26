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

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      payment.status = "FAILED";
      await payment.save();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // ✅ Verified
    payment.status = "SUCCESS";
    payment.providerPaymentId = razorpay_payment_id;
    await payment.save();

    await Order.findByIdAndUpdate(payment.orderId, {
      OrderStatus: "PAID",
      paymentStatus: "SUCCESS",
    });

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Payment verification error",
      error: error.message,
    });
  }
};
