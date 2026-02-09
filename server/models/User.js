import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
      unique: true,
      match: /^[0-9]{10}$/ // Only 10 digit numbers
    },

    name: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    isBlocked: {
      type: Boolean,
      default: false
    },

    lastLogin: {
      type: Date
    }
  },
  { timestamps: true }
);

/* 🔹 Update last login automatically */
userSchema.methods.updateLoginTime = function () {
  this.lastLogin = new Date();
  return this.save();
};

/* 🔹 Hide internal fields when sending to frontend */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);
