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
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items required" });
    }

    const order = await Order.create({
      userId: null,
      items,
      totalAmount: items[0].price * items[0].quantity,
      status: "PENDING",
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
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
