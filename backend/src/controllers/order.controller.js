import Order from "../models/order.model.js";

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
    try{
        const { userId, items, totalAmount } = req.body;
        const order = new Order({ userId, items, totalAmount });
        await order.save();
        res.status(201).json(order);
    }catch(err){
        res.status(500).json({ message: "Server Error", error: err.message });
    }
};