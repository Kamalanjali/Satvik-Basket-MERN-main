import Order from "../models/order.model.js";
import User from "../models/user.model.js";

/* ======================================
   ADMIN: Get all orders
====================================== */
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email")
      .populate("items.productId", "name price")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Get all orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/* ======================================
   CREATE ORDER (Guest or Logged-in)
====================================== */
export const createOrder = async (req, res, next) => {
  try {
    const { addressId, orderItems, paymentMethod, totalAmount } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const selectedAddress = user.addresses.id(addressId);
    if (!selectedAddress) {
      return res.status(404).json({ message: "Address not found" });
    }

    const order = await Order.create({
      user: req.user._id,

      orderItems: orderItems.map((item) => ({
        product: item.product, // ObjectId
        name: item.name,
        price: item.price,
        quantity: item.quantity,
      })),

      shippingAddress: {
        fullName: selectedAddress.fullName,
        phone: selectedAddress.phone,
        addressLine1: selectedAddress.addressLine1,
        addressLine2: selectedAddress.addressLine2,
        city: selectedAddress.city,
        state: selectedAddress.state,
        pincode: selectedAddress.pincode,
        country: selectedAddress.country,
      },

      totalAmount,
      paymentMethod,
      paymentStatus: "PENDING",
      orderStatus: "CREATED",
    });

    res.status(201).json({ success: true, order });
  } catch (error) {
    console.error("❌ CREATE ORDER ERROR:", error);
    next(error);
  }
};

/* ======================================
   USER: Get my orders
====================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id, // MUST be _id (ObjectId)
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("❌ Fetch my orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};

/* ======================================
   OPTIONAL: Latest pending order
   (useful for payments later)
====================================== */
export const getLatestPendingOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      userId: req.user.id,
      status: "PENDING",
    })
      .sort({ createdAt: -1 })
      .populate("items.productId", "name price");

    res.status(200).json(order || null);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch pending order",
    });
  }
};

/* ======================================
   Get order by ID (admin or owner)
====================================== */
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Optional security check (recommended)
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to view this order",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("GET ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch order",
    });
  }
};
