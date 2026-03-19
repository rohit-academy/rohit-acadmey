import multer from "multer";

/* 📦 Memory storage */
const storage = multer.memoryStorage();

/* 🎯 SMART FILE FILTER */
const fileFilter = (req, file, cb) => {

  console.log("FIELD:", file.fieldname);
  console.log("MIME:", file.mimetype);

  /* 📄 PDF */
  if (file.fieldname === "file") {

    const isPDF =
      file.mimetype === "application/pdf" ||
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPDF) {
      return cb(new Error("❌ Only PDF files are allowed"), false);
    }

    return cb(null, true);
  }

  /* 🖼 THUMBNAIL */
  if (file.fieldname === "thumbnail") {

    const isImage =
      file.mimetype.startsWith("image/") ||
      /\.(jpg|jpeg|png|webp)$/i.test(file.originalname);

    if (!isImage) {
      return cb(new Error("❌ Only image files allowed for thumbnail"), false);
    }

    return cb(null, true);
  }

  /* 🔥 IMPORTANT: allow other fields */
  return cb(null, true);
};

/* 📤 MULTI FIELD UPLOAD */
export const uploadPDF = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024
  }
});

/* 🖼 OPTIONAL preview images */
export const uploadPreviewImages = multer({
  storage,
  limits: {
    fileSize: 2 * 1024 * 1024
  }
}).array("previewImages", 5);

/* 🚨 ERROR HANDLER */
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