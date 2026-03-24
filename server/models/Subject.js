import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true, // ✅ FIX
      minlength: 2,
      maxlength: 50
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
      default: "",
      maxlength: 500
    },

    icon: {
      type: String,
      default: ""
    },

    order: {
      type: Number,
      default: 0,
      min: 0
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

/* =====================================
   🔥 UNIQUE INDEX (SAFE)
===================================== */
subjectSchema.index(
  { name: 1, classId: 1, stream: 1 },
  { unique: true }
);

/* =====================================
   🔥 SORT OPTIMIZATION
===================================== */
subjectSchema.index({ classId: 1, stream: 1, order: 1 });

/* =====================================
   🔥 PRE-SAVE CLEAN
===================================== */
subjectSchema.pre("save", function (next) {
  if (this.name) {
    this.name = this.name.trim().toLowerCase();
  }
  next();
});

export default mongoose.model("Subject", subjectSchema);