import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

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
    const userId = req.user._id; // from auth middleware
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Order items are required" });
    }

    let totalAmount = 0;

    // Calculate total on backend
    for (let item of items) {
      const product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }

      totalAmount += product.price * item.quantity;
    }

    const order = await Order.create({
      userId,
      items,
      totalAmount,
      status: "PENDING"
    });

    res.status(201).json({
      success: true,
      order
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: err.message
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
