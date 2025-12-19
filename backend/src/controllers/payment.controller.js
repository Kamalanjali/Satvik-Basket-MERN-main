import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";

/**
 * Create Payment (INITIATED)
 */
export const createPayment = async (req, res) => {
  try {
    const { orderId, amount, provider } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const payment = await Payment.create({
      orderId,
      amount,
      provider
    });

    res.status(201).json({
      success: true,
      payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

/**
 * Mark Payment as SUCCESS
 */
export const markPaymentSuccess = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { providerPaymentId } = req.body;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "SUCCESS";
    payment.providerPaymentId = providerPaymentId;

    await payment.save();

    // Optional but VERY GOOD practice
    await Order.findByIdAndUpdate(payment.orderId, {
      status: "PAID"
    });

    res.status(200).json({
      success: true,
      message: "Payment marked as SUCCESS",
      payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};

/**
 * Mark Payment as FAILED
 */
export const markPaymentFailed = async (req, res) => {
  try {
    const { paymentId } = req.params;

    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found"
      });
    }

    payment.status = "FAILED";
    await payment.save();

    res.status(200).json({
      success: true,
      message: "Payment marked as FAILED",
      payment
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
    });
  }
};
