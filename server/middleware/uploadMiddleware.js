import multer from "multer";

/* 📦 Memory storage → direct Cloudinary upload */
const storage = multer.memoryStorage();

/* 📄 Only PDF allowed (mimetype + extension check) */
const fileFilter = (req, file, cb) => {
  const isPDFMime = file.mimetype === "application/pdf";
  const isPDFExt = file.originalname.toLowerCase().endsWith(".pdf");

  if (isPDFMime && isPDFExt) {
    cb(null, true);
  } else {
    cb(new Error("❌ Only PDF files are allowed"), false);
  }
};

/* 📤 Upload single PDF */
export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/* 🖼 Future use → multiple preview images (optional) */
export const uploadPreviewImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB per image
  }
}).array("previewImages", 5); // max 5 images

/* 🚨 Multer error handler middleware */
export const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message:
        err.code === "LIMIT_FILE_SIZE"
          ? "❌ File too large. Max size is 10MB"
          : err.message
    });
  }

  if (err) {
    return res.status(400).json({
      success: false,
      message: err.message || "File upload error"
    });
  }

  next();
};
