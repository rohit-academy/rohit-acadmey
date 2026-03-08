import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    classId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true
    },

    stream: {
      type: String,
      enum: ["PCB", "PCM", "Arts", "General"],
      default: "General"
    },

    description: {
      type: String,
      default: ""
    },

    icon: {
      type: String,
      default: ""
    },

    order: {
      type: Number,
      default: 0
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

/* 🔎 Prevent duplicate subject in same class */
subjectSchema.index({ name: 1, classId: 1, stream: 1 }, { unique: true });

export default mongoose.model("Subject", subjectSchema);