import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    /* 🔒 Token present? */
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing"
      });
    }

    const token = authHeader.split(" ")[1];

    /* 🔐 Verify token */
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    /* 👤 Get user */
    const user = await User.findById(decoded.id).select("-__v");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists"
      });
    }

    /* 🚫 Blocked account check */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Account is blocked"
      });
    }

    /* 📦 Attach user */
    req.user = user;

    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

export default authMiddleware;
