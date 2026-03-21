import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* 📱 PHONE (optional for Google users) */
    phone: {
      type: String,
      unique: true,
      sparse: true, // ✅ allow multiple nulls
      match: [/^[0-9]{10}$/, "Phone must be 10 digits"]
    },

    /* 📧 EMAIL (for Google login) */
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true
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

    /* 🚫 BLOCK STATUS */
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
   🔹 INDEXES (IMPORTANT FOR PERFORMANCE)
===================================== */
userSchema.index({ phone: 1 });
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

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