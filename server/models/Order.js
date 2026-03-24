import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true
      }
    ],

    amount: {
      type: Number,
      required: true,
      min: 1
    },

    currency: {
      type: String,
      default: "INR"
    },

    razorpay_order_id: {
      type: String,
      required: true,
      index: true
    },

    razorpay_payment_id: {
      type: String,
      unique: true,
      sparse: true
    },

    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    paidAt: {
      type: Date
    }
  },
  { timestamps: true }
);

/* =====================================
   🔥 INDEXES
===================================== */
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);