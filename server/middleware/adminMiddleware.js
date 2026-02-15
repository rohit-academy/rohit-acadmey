const adminMiddleware = (req, res, next) => {
  try {
    /* 🔐 USER CHECK */
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user data"
      });
    }

    /* ⛔ BLOCKED USER */
    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked. Contact support."
      });
    }

    /* 🛡 ROLE CHECK */
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admins only"
      });
    }

    /* ✅ PASS */
    next();

  } catch (error) {
    console.error("🔥 Admin middleware error:", error.message);

    res.status(500).json({
      success: false,
      message: "Admin authorization failed"
    });
  }
};

/* 🔁 Named export for flexibility */
export const adminOnly = adminMiddleware;

/* 🔁 Default export */
export default adminMiddleware;
