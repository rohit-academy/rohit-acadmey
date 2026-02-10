const adminMiddleware = (req, res, next) => {
  try {
    // 🔐 authMiddleware pehle hi user attach karta hai
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    // 🛑 Blocked users bhi admin nahi ban sakte
    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked"
      });
    }

    // 👑 Role check
    if (req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Admin access only"
      });
    }

    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Admin check failed"
    });
  }
};
