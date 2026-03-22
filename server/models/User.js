import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* 📱 PHONE (optional for Google users) */
    phone: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined,
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
    },

    /* 📧 EMAIL */
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      default: undefined
    },

    /* 🔵 GOOGLE ID */
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      default: undefined
    },

    /* 👤 NAME */
    name: {
      type: String,
      trim: true,
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

    /* ✅ VERIFIED */
    isVerified: {
      type: Boolean,
      default: false
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
  {
    timestamps: true
  }
);

/* =====================================
   🔹 UPDATE LAST LOGIN
===================================== */
userSchema.methods.updateLoginTime = function () {
  this.lastLogin = new Date();
  return this.save();
};

/* =====================================
   🔹 CLEAN RESPONSE
===================================== */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);