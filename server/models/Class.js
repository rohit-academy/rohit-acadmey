import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    /* 📘 CLASS NAME */
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      minlength: 1,
      maxlength: 50,
      index: true
    },

    /* 🔢 CLASS NUMBER (IMPORTANT 🔥) */
    classNumber: {
      type: Number,
      required: true,
      unique: true,
      min: 1,
      max: 20,
      index: true
    },

    /* 🎓 LEVEL */
    level: {
      type: String,
      enum: ["School", "College"],
      default: "School",
      index: true
    },

    /* 🔥 STREAM ENABLE FLAG */
    hasStreams: {
      type: Boolean,
      default: false,
      index: true
    },

    /* 🔢 ORDER */
    order: {
      type: Number,
      default: 0,
      min: 0
    },

    /* 📝 DESCRIPTION */
    description: {
      type: String,
      default: "",
      maxlength: 500
    },

    /* 🔥 ACTIVE */
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

/* =====================================
   🔥 AUTO STREAM LOGIC
===================================== */
classSchema.pre("save", function (next) {

  /* 🔹 NAME CLEAN */
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }

  /* 🔥 AUTO STREAM ENABLE (11+ CLASS) */
  if (this.classNumber >= 11) {
    this.hasStreams = true;
  } else {
    this.hasStreams = false;
  }

  next();
});

/* =====================================
   🔥 INDEXES
===================================== */
classSchema.index({ level: 1, order: 1 });
classSchema.index({ classNumber: 1, isActive: 1 });

/* =====================================
   🔥 STATIC METHODS (PRO 🔥)
===================================== */

/* 📄 GET ALL CLASSES SORTED */
classSchema.statics.getAllActive = function () {
  return this.find({ isActive: true })
    .sort({ order: 1 })
    .lean();
};

/* 📄 CHECK IF STREAM REQUIRED */
classSchema.statics.requiresStream = async function (classId) {
  const cls = await this.findById(classId).select("classNumber");
  return cls?.classNumber >= 11;
};

export default mongoose.model("Class", classSchema);