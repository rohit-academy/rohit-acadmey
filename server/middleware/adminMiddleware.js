import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    /* 🔐 AUTH HEADER CHECK */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin token missing",
      });
    }

    /* 🔑 TOKEN EXTRACT */
    const token = authHeader.split(" ")[1];

    /* 🔍 VERIFY TOKEN */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* 🛡 ROLE CHECK */
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    /* ✅ SAVE ADMIN DATA */
    req.admin = decoded;

    next();
  } catch (error) {
    console.error("🔥 Admin middleware error:", error.message);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired admin token",
    });
  }
};

/* 🔁 Named export */
export const adminOnly = adminMiddleware;

/* 🔁 Default export */
export default adminMiddleware;
