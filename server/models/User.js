import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* 📱 PHONE (optional now) */
    phone: {
      type: String,
      required: false,   // ❗ FIXED
      unique: true,
      sparse: true,      // ✅ allow null unique
      match: /^[0-9]{10}$/
    },

    /* 📧 EMAIL (for Google login) */
    email: {
      type: String,
      unique: true,
      sparse: true       // ✅ important (warna null conflict hoga)
    },

    /* 🔵 GOOGLE ID */
    googleId: {
      type: String,
      unique: true,
      sparse: true
    },

    /* 👤 NAME */
    name: {
      type: String,
      default: ""
    },

    /* 🖼 AVATAR */
    avatar: {
      type: String,
      default: ""
    },

    /* 🔐 AUTH PROVIDER */
    authProvider: {
      type: String,
      enum: ["phone", "google"],
      default: "phone"
    },

    /* 👑 ROLE */
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },

    /* 🚫 BLOCK */
    isBlocked: {
      type: Boolean,
      default: false
    },

    /* 🕒 LAST LOGIN */
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

/* 🔹 Clean response */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);