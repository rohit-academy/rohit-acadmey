import jwt from "jsonwebtoken";
import User from "../models/User.js";

/* =====================================
   🔐 PROTECT MIDDLEWARE (FINAL)
===================================== */
export const protect = async (req, res, next) => {
  try {

    /* =====================================
       🔐 GET TOKEN
    ===================================== */
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authorized, no token"
      });
    }

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
       🛠 ADMIN SHORTCUT
    ===================================== */
    if (decoded.role === "admin") {
      req.user = {
        _id: "admin",
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
       📌 ATTACH USER (FINAL FIX)
    ===================================== */
    req.user = {
      _id: user._id,   // 🔥 MAIN FIX
      id: user._id,    // backward compatibility
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

    console.error("🔥 Auth middleware error:", error);

    return res.status(500).json({
      success: false,
      message: "Authentication failed"
    });

  }
};

/* =====================================
   🔁 EXPORT DEFAULT (OPTIONAL)
===================================== */
export default protect;