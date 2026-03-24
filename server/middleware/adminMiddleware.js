import User from "../models/User.js";

/* =====================================
   🔐 ADMIN ONLY MIDDLEWARE
===================================== */
const adminOnly = async (req, res, next) => {
  try {

    /* ❌ USER MISSING */
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    /* 🔍 VERIFY USER FROM DB */
    const user = await User.findById(req.user.id).select("role isBlocked");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    /* ⛔ BLOCK CHECK */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account blocked",
      });
    }

    /* 🔐 ROLE CHECK */
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only",
      });
    }

    next();

  } catch (error) {
    console.error("🔥 Admin middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Admin authorization failed",
    });
  }
};

export { adminOnly };
export default adminOnly;