import multer from "multer";

/* 📦 Memory storage (direct S3 upload ke liye best) */
const storage = multer.memoryStorage();

/* 🔐 File filter (sirf PDF allow) */
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

/* 📏 File size limit (10MB) */
export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
