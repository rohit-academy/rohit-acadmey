import multer from "multer";

/* 📦 Memory storage → direct Cloudinary upload */
const storage = multer.memoryStorage();

/* 🎯 SMART FILE FILTER (FIELD BASED) */
const fileFilter = (req, file, cb) => {

  /* 📄 PDF FIELD */
  if (file.fieldname === "file") {

    const isPDFMime = file.mimetype === "application/pdf";
    const isPDFExt = file.originalname.toLowerCase().endsWith(".pdf");

    if (isPDFMime || isPDFExt) {
      return cb(null, true);
    } else {
      return cb(new Error("❌ Only PDF files are allowed"), false);
    }

  }

  /* 🖼 THUMBNAIL FIELD */
  if (file.fieldname === "thumbnail") {

    const isImage = file.mimetype.startsWith("image/");

    if (isImage) {
      return cb(null, true);
    } else {
      return cb(new Error("❌ Only image files allowed for thumbnail"), false);
    }

  }

  /* ❌ UNKNOWN FIELD */
  return cb(new Error("❌ Invalid file field"), false);
};

/* 📤 MULTI FIELD UPLOAD (PDF + THUMBNAIL) */
export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

/* 🖼 OPTIONAL: multiple preview images (future use) */
export const uploadPreviewImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB per image
  }
}).array("previewImages", 5);

/* 🚨 Multer error handler */
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