import jwt from "jsonwebtoken";

/**
 * 🔐 Generate JWT Token
 * @param {Object} payload - must be plain object (id, role, etc)
 * @param {String} expiresIn - token expiry (default: 7d)
 */
const generateToken = (payload, expiresIn = "7d") => {

  /* ❌ SAFETY CHECK */
  if (!payload || typeof payload !== "object") {
    throw new Error("Payload must be a plain object");
  }

  /* 🔐 SIGN TOKEN */
  return jwt.sign(
    payload,
    process.env.JWT_SECRET,
    { expiresIn }
  );
};

export default generateToken;