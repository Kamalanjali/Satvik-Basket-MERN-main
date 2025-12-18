import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true
    },
    provider: { type: String, required: true },
    providerPaymentId: String,
    amount: Number,
    status: {
      type: String,
      enum: ["INITIATED", "SUCCESS", "FAILED"],
      default: "INITIATED"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", paymentSchema);
