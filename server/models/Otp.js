import mongoose from "mongoose";

const otpSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      index: true
    },

    otp: {
      type: String,
      required: true
    },

    expiresAt: {
      type: Date,
      required: true,
      index: true
    },

    attempts: {
      type: Number,
      default: 0,
      max: 5 // 🔥 brute-force protection
    }
  },
  { timestamps: true }
);

/* =====================================
   🔥 TTL INDEX (AUTO DELETE)
===================================== */
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

/* =====================================
   🔥 ONE ACTIVE OTP PER PHONE
===================================== */
otpSchema.index(
  { phone: 1 },
  { unique: true }
);

/* =====================================
   🔥 NORMALIZE PHONE
===================================== */
otpSchema.pre("save", function (next) {
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, "").slice(-10);
  }
  next();
});

export default mongoose.model("Otp", otpSchema);