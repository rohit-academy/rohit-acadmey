import multer from "multer";

/* 📦 Memory storage → Cloudinary direct upload */
const storage = multer.memoryStorage();

/* 📄 Only PDF allowed */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("❌ Only PDF files are allowed"), false);
  }
};

export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});
