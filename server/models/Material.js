import mongoose from "mongoose";
import slugify from "slugify";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true,
      minlength: 3,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 1000,
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
      index: true,
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: ["Notes", "Sample Paper", "PYQ", "Assignment"],
      required: true,
      index: true,
    },

    pages: {
      type: Number,
      default: 0,
      min: 0,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
      max: 5000,
      index: true,
    },

    isFree: {
      type: Boolean,
      default: false
    },

    fileUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      default: "",
      index: true,
    },

    thumbnail: {
      type: String,
      default: "",
    },

    previewImages: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    downloads: {
      type: Number,
      default: 0,
      min: 0,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (v) => Math.round(v * 10) / 10, // 🔥 1 decimal only
    },

    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/* =====================================
   🔥 SLUG AUTO GENERATE
===================================== */
materialSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  next();
});

/* =====================================
   🔥 FILTER INDEX
===================================== */
materialSchema.index({
  classId: 1,
  subjectId: 1,
  type: 1,
  isActive: 1,
});

/* =====================================
   🔎 TEXT SEARCH
===================================== */
materialSchema.index({
  title: "text",
  description: "text",
});

/* =====================================
   ⚡ SORT OPTIMIZATION
===================================== */
materialSchema.index({ createdAt: -1 });
materialSchema.index({ price: 1 });
materialSchema.index({ rating: -1 });

export default mongoose.model("Material", materialSchema);