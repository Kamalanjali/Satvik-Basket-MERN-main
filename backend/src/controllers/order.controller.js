import mongoose from "mongoose";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

const TEMP_USER_ID = new mongoose.Types.ObjectId("64b000000000000000000001");

// Controller to get all orders
export const getAllOrders = async (req, res) => {
    try{
        const orders = await Order.find().populate('userId', 'name email').populate('items.productId', 'name price');
        res.status(200).json(orders);

    }catch(err){
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};

// Controller to create a new order
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    // Basic validation
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain items",
      });
    }

    if (!totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Total amount is required",
      });
    }

    if (
      !address ||
      !address.name ||
      !address.phone ||
      !address.street ||
      !address.city ||
      !address.state ||
      !address.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Complete delivery address is required",
      });
    }

    const order = await Order.create({
      items,
      totalAmount,
      address,
      // userId intentionally optional (guest checkout)
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Create order error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error while creating order",
    });
  }
};






// Controller to get the logged-in user's past orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate("items.productId", "name price");

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    res.status(500).json({ message: "Server Error", error: err.message });
  }
};

export const getLatestPendingOrder = async (req, res) => {
  const order = await Order.findOne({ status: "PENDING" })
    .sort({ createdAt: -1 })
    .populate("items.productId", "name price");

  res.json(order || { items: [], totalAmount: 0 });
};
