const errorMiddleware = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  /* 🧬 MONGOOSE DUPLICATE KEY */
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`,
    });
  }

  /* 🧬 INVALID OBJECT ID */
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  /* 🧬 MONGOOSE VALIDATION ERROR */
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((val) => val.message);
    return res.status(400).json({
      success: false,
      message: messages.join(", "),
    });
  }

  /* 📄 MULTER FILE TYPE ERROR */
  if (err.message === "Only PDF files are allowed") {
    return res.status(400).json({
      success: false,
      message: "Only PDF files are allowed",
    });
  }

  /* 📄 MULTER FILE SIZE ERROR */
  if (err.code === "LIMIT_FILE_SIZE") {
    return res.status(400).json({
      success: false,
      message: "File size should be less than 10MB",
    });
  }

  /* ☁️ CLOUDINARY ERROR */
  if (err.name === "CloudinaryError") {
    return res.status(500).json({
      success: false,
      message: "Cloud upload failed",
    });
  }

  /* 🔐 JWT INVALID */
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }

  /* 🔐 JWT EXPIRED */
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({
      success: false,
      message: "Session expired, please login again",
    });
  }

  /* 🚨 DEFAULT */
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

export default errorMiddleware;
