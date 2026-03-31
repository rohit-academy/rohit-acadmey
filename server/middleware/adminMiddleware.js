import User from "../models/User.js";
import logger from "../utils/logger.js";

/* =====================================
   🔐 ADMIN ONLY MIDDLEWARE (PRO VERSION)
===================================== */
const adminOnly = async (req, res, next) => {
  try {

    /* =====================================
       🔍 BASIC AUTH CHECK
    ===================================== */
    if (!req.user?.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access"
      });
    }

    /* =====================================
       ⚡ FAST PATH (TOKEN ROLE)
       👉 agar already admin hai token me
    ===================================== */
    if (req.user.role === "admin") {
      return next();
    }

    /* =====================================
       🔍 DB VERIFY (FALLBACK)
    ===================================== */
    const user = await User.findById(req.user.id)
      .select("role isBlocked")
      .lean();

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found"
      });
    }

    /* =====================================
       ⛔ BLOCK CHECK
    ===================================== */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked"
      });
    }

    /* =====================================
       🔐 ROLE CHECK
    ===================================== */
    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied (admin only)"
      });
    }

    /* =====================================
       🔥 ATTACH CLEAN USER
    ===================================== */
    req.user.role = user.role;

    next();

  } catch (error) {

    logger.error(`Admin middleware error: ${error.message}`);

    return res.status(500).json({
      success: false,
      message: "Admin authorization failed"
    });
  }
};

export { adminOnly };
export default adminOnly;