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

    /* 👤 USERNAME (🔥 MAIN FIELD) */
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,          // 🔥 UNIQUE USERNAME
      sparse: true,          // allow empty for new users
      default: "",
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username max 20 characters"],
      match: [
        /^[a-z0-9_]+$/,
        "Username can only contain lowercase letters, numbers, and underscore"
      ]
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
   🔥 INDEXES (SAFE UNIQUE)
===================================== */
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ googleId: 1 }, { unique: true, sparse: true });
userSchema.index({ name: 1 }, { unique: true, sparse: true }); // 🔥 username unique

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