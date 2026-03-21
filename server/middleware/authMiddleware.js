import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {
    /* =====================================
       🔐 TOKEN CHECK
    ===================================== */
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];

    /* =====================================
       🧬 VERIFY TOKEN
    ===================================== */
    let decoded;

    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Session expired, please login again",
        });
      }

      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    /* =====================================
       ⚠️ TOKEN STRUCTURE CHECK (🔥 FIX)
    ===================================== */
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload",
      });
    }

    /* =====================================
       👤 GET USER
    ===================================== */
    const user = await User.findById(decoded.id).select(
      "_id name phone email role isBlocked authProvider"
    );

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User no longer exists",
      });
    }

    /* =====================================
       ⛔ BLOCK CHECK
    ===================================== */
    if (user.isBlocked) {
      return res.status(403).json({
        success: false,
        message: "Your account is blocked",
      });
    }

    /* =====================================
       📌 ATTACH USER (🔥 IMPORTANT)
    ===================================== */
    req.user = {
      id: user._id,        // 🔥 use this everywhere (IMPORTANT FIX)
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
    };

    next();

  } catch (error) {
    console.error("🔥 Auth middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

/* =====================================
   🔁 EXPORTS
===================================== */
export const protect = authMiddleware;
export default authMiddleware;