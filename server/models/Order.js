import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    materials: [{ type: mongoose.Schema.Types.ObjectId, ref: "Material" }],
    amount: Number,
    razorpay_order_id: String,
    razorpay_payment_id: String,
    status: { type: String, default: "Pending" }
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
