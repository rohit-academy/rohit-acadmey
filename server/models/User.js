import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* 📱 PHONE */
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

    /* 👤 USERNAME */
    name: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      default: undefined, // ✅ FIXED
      minlength: 3,
      maxlength: 20,
      match: [/^[a-z0-9_]+$/, "Invalid username"]
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
   🔥 SAFE UNIQUE INDEXES (PARTIAL)
===================================== */
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $exists: true } } }
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

userSchema.index(
  { googleId: 1 },
  { unique: true, partialFilterExpression: { googleId: { $exists: true } } }
);

userSchema.index(
  { name: 1 },
  { unique: true, partialFilterExpression: { name: { $exists: true } } }
);

/* =====================================
   🔥 PRE-SAVE CLEAN USERNAME
===================================== */
userSchema.pre("save", function (next) {

  if (this.name) {
    this.name = this.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  next();
});

/* =====================================
   🔹 METHODS
===================================== */
userSchema.methods.updateLoginTime = function () {
  this.lastLogin = new Date();
  return this.save();
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);