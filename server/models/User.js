import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    /* 🔥 FIREBASE UID */
    firebaseId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      trim: true
    },

    /* 📱 PHONE (10 DIGITS ONLY) */
    phone: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
      match: [/^[6-9]\d{9}$/, "Invalid phone number"],
      default: undefined
    },

    /* 📧 EMAIL */
    email: {
      type: String,
      unique: true,
      sparse: true,
      lowercase: true,
      trim: true,
      index: true,
      default: undefined
    },

    /* 👤 USERNAME (UNIQUE HANDLE) */
    username: {
      type: String,
      unique: true,
      sparse: true,
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
      enum: ["firebase", "google", "phone"],
      default: "firebase"
    },

    /* 👑 ROLE */
    role: {
      type: String,
      enum: ["user", "admin"],
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
    }
  },
  {
    timestamps: true
  }
);

/* =====================================
   🔥 SAFE INDEXES
===================================== */

userSchema.index(
  { firebaseId: 1 },
  { unique: true, partialFilterExpression: { firebaseId: { $exists: true } } }
);

userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $exists: true } } }
);

userSchema.index(
  { email: 1 },
  { unique: true, partialFilterExpression: { email: { $exists: true } } }
);

userSchema.index(
  { username: 1 },
  { unique: true, partialFilterExpression: { username: { $exists: true } } }
);

/* =====================================
   🔥 PRE SAVE CLEANUP
===================================== */
userSchema.pre("save", function (next) {

  /* 🔹 USERNAME CLEAN */
  if (this.username) {
    this.username = this.username
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "");
  }

  /* 🔹 PHONE CLEAN (+91 REMOVE) */
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, "").slice(-10);
  }

  next();
});

/* =====================================
   🔹 METHODS
===================================== */

/* 🔥 UPDATE LOGIN TIME */
userSchema.methods.updateLoginTime = function () {
  this.lastLogin = new Date();
  return this.save();
};

/* 🔥 CLEAN RESPONSE */
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export default mongoose.model("User", userSchema);