const adminMiddleware = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Not authorized"
      });
    }

    if (req.user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked"
      });
    }

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

// 🔥 THIS FIXES YOUR ERROR
export const adminOnly = adminMiddleware;
export default adminMiddleware;
