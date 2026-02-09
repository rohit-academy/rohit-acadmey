import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    level: {
      type: String,
      enum: ["School", "College"],
      default: "School"
    },

    order: {
      type: Number,
      default: 0 // UI display order
    },

    streams: [
      {
        type: String,
        enum: ["PCB", "PCM", "Arts", "Commerce", "General"]
      }
    ],

    description: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export default mongoose.model("Class", classSchema);
