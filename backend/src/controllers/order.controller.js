import Order from "../models/order.model.js";

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
export const createOrder = async (req, res) => {
  try {
    const { items, totalAmount, address } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order must contain items",
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
      userId: req.user.id,                 // ✅ always present
      items,
      totalAmount,
      address: {
        ...address,
        email: req.user.email,             // ✅ inject here
      },
      status: "PENDING",
    });

    return res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("❌ Create order error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order",
    });
  }
};


/* ======================================
   USER: Get my orders
====================================== */
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 });

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
