import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => {
  try {

    /* =====================================
       🔐 EXTRACT TOKEN
    ===================================== */
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token missing"
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

      const message =
        err.name === "TokenExpiredError"
          ? "Session expired, please login again"
          : "Invalid token";

      return res.status(401).json({
        success: false,
        message
      });
    }

    /* =====================================
       ⚠️ PAYLOAD CHECK
    ===================================== */
    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token payload"
      });
    }

    /* =====================================
       🛠 ADMIN SHORT-CIRCUIT
    ===================================== */
    if (decoded.role === "admin") {
      req.user = {
        id: "admin",
        role: "admin"
      };
      return next();
    }

    /* =====================================
       👤 FETCH USER
    ===================================== */
    const user = await User.findById(decoded.id)
      .select("_id name phone email role isBlocked authProvider avatar lastLogin")
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
       📌 ATTACH USER
    ===================================== */
    req.user = {
      id: user._id,
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      avatar: user.avatar,
      lastLogin: user.lastLogin
    };

    next();

  } catch (error) {

    console.error("🔥 Auth middleware error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });

  }
};

/* =====================================
   🔁 EXPORTS
===================================== */
export const protect = authMiddleware;
export default authMiddleware;