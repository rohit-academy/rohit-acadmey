import mongoose from "mongoose";

const materialSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    subjectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
      required: true
    },

    type: {
      type: String,
      enum: ["Notes", "Sample Paper", "PYQ", "Assignment"],
      required: true
    },

    pages: {
      type: Number,
      default: 0
    },

    price: {
      type: Number,
      required: true
    },

    fileUrl: {
      type: String, // S3 / Cloud storage link
      required: true
    },

    previewImages: [
      {
        type: String
      }
    ],

    isActive: {
      type: Boolean,
      default: true
    },

    downloads: {
      type: Number,
      default: 0
    },

    rating: {
      type: Number,
      default: 0
    },

    reviewsCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Material", materialSchema);