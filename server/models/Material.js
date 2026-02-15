import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true, // 🔍 search fast
    },

    description: {
      type: String,
      default: "",
      trim: true,
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
      index: true, // 💰 price filter fast
    },

    fileUrl: {
      type: String,
      required: true,
    },

    cloudinaryId: {
      type: String,
      default: "",
      index: true, // 🔁 delete/replace fast
    },

    previewImages: [
      {
        type: String,
      },
    ],

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
    },

    reviewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

/* 🔍 Compound index for filters */
materialSchema.index({ classId: 1, subjectId: 1, type: 1, isActive: 1 });

/* 🔎 Text search (title + description) */
materialSchema.index({
  title: "text",
  description: "text",
});

export default mongoose.model("Material", materialSchema);
