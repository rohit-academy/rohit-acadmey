import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    /* 👤 USER */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    /* 📦 MATERIALS */
    materials: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material",
        required: true
      }
    ],

    /* 💰 AMOUNT */
    amount: {
      type: Number,
      required: true,
      min: 1
    },

    /* 💱 CURRENCY */
    currency: {
      type: String,
      default: "INR"
    },

    /* 🧾 RAZORPAY */
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

    /* 📊 STATUS */
    status: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true
    },

    /* 🕒 PAYMENT TIME */
    paidAt: {
      type: Date
    },

    /* 🔐 PAYMENT META */
    paymentMethod: {
      type: String,
      default: "razorpay"
    },

    receipt: {
      type: String
    },

    failureReason: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

/* =====================================
   🔥 INDEXES (PERFORMANCE BOOST)
===================================== */

/* User purchase history fast */
orderSchema.index({ user: 1, createdAt: -1 });

/* Prevent duplicate same material purchase (soft level) */
orderSchema.index(
  { user: 1, materials: 1, status: 1 },
  {
    partialFilterExpression: { status: "paid" }
  }
);

/* =====================================
   🔥 PRE SAVE SAFETY
===================================== */
orderSchema.pre("save", function () {

  /* Ensure paidAt when status = paid */
  if (this.status === "paid" && !this.paidAt) {
    this.paidAt = new Date();
  }

});

/* =====================================
   🔥 METHODS
===================================== */

/* Mark as failed */
orderSchema.methods.markFailed = function (reason = "") {
  this.status = "failed";
  this.failureReason = reason;
  return this.save();
};

/* Mark as paid */
orderSchema.methods.markPaid = function (paymentId) {
  this.status = "paid";
  this.razorpay_payment_id = paymentId;
  this.paidAt = new Date();
  return this.save();
};

/* =====================================
   🔥 CLEAN RESPONSE
===================================== */
orderSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("Order", orderSchema);