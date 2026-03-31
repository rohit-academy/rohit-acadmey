import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    /* 🔥 FIREBASE UID */
    firebaseId: {
      type: String,
      trim: true,
      default: undefined
    },

    /* 📱 PHONE */
    phone: {
      type: String,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      default: undefined
    },

    /* 📧 EMAIL */
    email: {
      type: String,
      lowercase: true,
      trim: true,
      default: undefined
    },

    /* 🔐 PASSWORD */
    password: {
      type: String,
      minlength: 6,
      select: false
    },

    /* 👤 USERNAME */
    username: {
      type: String,
      lowercase: true,
      trim: true,
      minlength: 3,
      maxlength: 20,
      match: [/^[a-z0-9_]+$/, "Invalid username"],
      default: undefined
    },

    /* 👤 DISPLAY NAME */
    name: {
      type: String,
      trim: true,
      maxlength: 50
    },

    /* 🖼 AVATAR */
    avatar: {
      type: String,
      default: ""
    },

    /* 🔐 AUTH PROVIDER */
    authProvider: {
      type: String,
      enum: ["firebase", "google", "phone", "email"],
      default: "firebase"
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
      default: true
    },

    /* 🚫 BLOCK */
    isBlocked: {
      type: Boolean,
      default: false,
      index: true
    },

    /* 🕒 LAST LOGIN */
    lastLogin: {
      type: Date,
      default: Date.now
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
   🔥 INDEXES
===================================== */
userSchema.index({ firebaseId: 1 }, { unique: true, sparse: true });
userSchema.index({ phone: 1 }, { unique: true, sparse: true });
userSchema.index({ email: 1 }, { unique: true, sparse: true });
userSchema.index({ username: 1 }, { unique: true, sparse: true });

/* =====================================
   🔥 PRE SAVE (NO NEXT - CLEAN)
===================================== */
userSchema.pre("save", async function () {

  /* 🔹 USERNAME CLEAN */
  if (this.username) {
    this.username = this.username
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
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

});

/* =====================================
   🔐 METHODS
===================================== */

/* 🔑 COMPARE PASSWORD */
userSchema.methods.comparePassword = async function (enteredPassword) {
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
    this.lockUntil = Date.now() + 15 * 60 * 1000;
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