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
      type: String, // optional icon/image URL
      default: ""
    },

    order: {
      type: Number,
      default: 0   // display order
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Subject", subjectSchema);