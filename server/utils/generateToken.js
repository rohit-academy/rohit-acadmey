import jwt from "jsonwebtoken";

/**
 * 🔐 Generate JWT Token
 * @param {Object} payload - { id, role }
 * @param {String} expiresIn - default: 7d
 */
const generateToken = (payload, expiresIn = "7d") => {

  try {

    /* ❌ SECRET CHECK */
    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    /* ❌ PAYLOAD CHECK */
    if (!payload || typeof payload !== "object") {
      throw new Error("Payload must be a plain object");
    }

    /* 🔥 SAFE PAYLOAD (WHITELIST) */
    const safePayload = {
      id: payload.id,
      role: payload.role || "user"
    };

    /* 🔐 SIGN TOKEN */
    return jwt.sign(
      safePayload,
      process.env.JWT_SECRET,
      {
        expiresIn,
        algorithm: "HS256",
        issuer: "rohit-academy",
      }
    );

  } catch (error) {

    console.error("❌ Token generation failed:", error.message);
    throw new Error("Failed to generate token");

  }
};

export default generateToken;