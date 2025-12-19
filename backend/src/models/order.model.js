import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: String,
        price: Number,
        quantity: Number
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["PAID", "PENDING", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PENDING"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

