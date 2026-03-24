import mongoose from "mongoose";

const classSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,        // 🔥 FIX
      unique: true,           // 🔥 FIX
      minlength: 2,
      maxlength: 50,
      index: true
    },

    level: {
      type: String,
      enum: ["School", "College"],
      default: "School",
      index: true
    },

    order: {
      type: Number,
      default: 0,
      min: 0
    },

    streams: [
      {
        type: String,
        enum: ["PCB", "PCM", "Arts", "Commerce", "General"]
      }
    ],

    description: {
      type: String,
      default: "",
      maxlength: 500
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  { timestamps: true }
);

/* =====================================
   🔥 CLEAN STREAMS (REMOVE DUPLICATES)
===================================== */
classSchema.pre("save", function (next) {
  if (this.streams && this.streams.length > 0) {
    this.streams = [...new Set(this.streams)];
  }

  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }

  next();
});

/* =====================================
   🔥 SORT OPTIMIZATION
===================================== */
classSchema.index({ level: 1, order: 1 });

export default mongoose.model("Class", classSchema);