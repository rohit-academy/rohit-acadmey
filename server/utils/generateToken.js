import jwt from "jsonwebtoken";

/**
 * 🔐 Generate JWT Token
 * @param {Object} payload - { id, role }
 * @param {String} expiresIn - default: 7d
 */
const generateToken = (payload = {}, expiresIn = "7d") => {
  try {

    /* ❌ SECRET CHECK */
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    /* ❌ PAYLOAD VALIDATION */
    if (!payload.id) {
      throw new Error("Payload must contain user id");
    }

    /* 🔥 SAFE PAYLOAD */
    const safePayload = {
      id: payload.id,
      role: payload.role || "user"
    };

    /* 🔐 SIGN TOKEN */
    const token = jwt.sign(
      safePayload,
      process.env.JWT_SECRET,
      {
        expiresIn,
        algorithm: "HS256",
        issuer: "rohit-academy",
        subject: String(payload.id) // 🔥 useful for tracking
      }
    );

    return token;

  } catch (error) {

    console.error("❌ Token generation failed:", error.message);

    throw new Error("Token generation failed");
  }
};

export default generateToken;