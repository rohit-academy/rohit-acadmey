import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* 🔥 FIREBASE UID */
    firebaseId: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      index: true
    },

    /* 📱 PHONE */
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      unique: true,
      sparse: true,
      index: true
    },

    /* 📧 EMAIL */
    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
      index: true
    },

    /* 🔐 PASSWORD */
    password: {
      type: String,
      minlength: 6,
      select: false
    },

    /* 👤 USERNAME (LOGIN HANDLE) */
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-z0-9_]+$/, "Invalid username"],
      unique: true,
      sparse: true,
      index: true
    },

    /* 👤 DISPLAY NAME */
    name: {
      type: String,
      trim: true,
      maxlength: 50,
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
      enum: ["firebase", "email"],
      default: "firebase",
      index: true
    },

    /* 👑 ROLE */
    role: {
      type: String,
      enum: ["user", "admin", "teacher"],
      default: "user",
      index: true
    },

    /* ✅ VERIFIED */
    isVerified: {
      type: Boolean,
      default: true,
      index: true
    },

    /* 🚫 BLOCK */
    isBlocked: {
      type: Boolean,
      default: false,
      index: true
    },

    /* 🕒 LOGIN INFO */
    lastLogin: {
      type: Date,
      default: Date.now
    },

    lastLoginIP: {
      type: String,
      default: ""
    },

    lastDevice: {
      type: String,
      default: ""
    },

    /* 🔐 SECURITY */
    loginAttempts: {
      type: Number,
      default: 0
    },

    lockUntil: {
      type: Date
    }
  },
  {
    timestamps: true
  }
);

/* =====================================
   🔥 COMPOUND INDEXES
===================================== */
userSchema.index({ role: 1, isBlocked: 1 });
userSchema.index({ email: 1, phone: 1 });

/* =====================================
   🔥 PRE SAVE (ULTRA SAFE)
===================================== */
userSchema.pre("save", async function () {
  try {

    /* 🔹 USERNAME CLEAN */
    if (this.username) {
      this.username = this.username
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "_")
        .replace(/[^a-z0-9_]/g, "");

      if (!this.username) {
        this.username = "user_" + Date.now().toString().slice(-6);
      }
    }

    /* 🔹 PHONE CLEAN */
    if (this.phone) {
      this.phone = this.phone.replace(/\D/g, "").slice(-10);
    }

    /* 🔹 EMAIL CLEAN */
    if (this.email) {
      this.email = this.email.toLowerCase().trim();
    }

    /* 🔐 PASSWORD HASH */
    if (this.isModified("password") && this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }

  } catch (err) {
    console.error("❌ Pre-save error:", err);
    throw err;
  }
});

/* =====================================
   🔐 METHODS
===================================== */

/* 🔑 COMPARE PASSWORD */
userSchema.methods.comparePassword = async function (enteredPassword) {
  if (!this.password) return false;
  return bcrypt.compare(enteredPassword, this.password);
};

/* 🔥 UPDATE LOGIN */
userSchema.methods.updateLoginTime = function () {
  this.lastLogin = new Date();
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

/* 🔐 LOGIN ATTEMPTS */
userSchema.methods.incrementLoginAttempts = function () {

  if (this.lockUntil && this.lockUntil > Date.now()) {
    return Promise.resolve(this);
  }

  this.loginAttempts += 1;

  if (this.loginAttempts >= 5) {
    this.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
  }

  return this.save();
};

/* 🔒 CHECK LOCK */
userSchema.methods.isLocked = function () {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

/* 🔥 SAFE RESPONSE */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.__v;
  delete obj.password;
  delete obj.loginAttempts;
  delete obj.lockUntil;

  return obj;
};

export default mongoose.model("User", userSchema);