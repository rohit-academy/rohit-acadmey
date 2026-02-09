import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    material: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Material",
      required: true
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      trim: true,
      maxlength: 500
    },

    isApproved: {
      type: Boolean,
      default: false   // Admin approval system
    }

  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
