import s3 from "../config/s3.js";
import crypto from "crypto";
import path from "path";

/* =====================================
   🔐 SAFE FILE NAME
===================================== */
const generateFileName = (originalName) => {
  const ext = path.extname(originalName);
  const uniqueId = crypto.randomBytes(6).toString("hex");
  return `${Date.now()}-${uniqueId}${ext}`;
};

/* =====================================
   📤 UPLOAD FILE TO S3
===================================== */
export const uploadFileToS3 = async (file) => {
  try {

    /* ❌ VALIDATION */
    if (!file || !file.buffer) {
      throw new Error("Invalid file");
    }

    /* ❌ SIZE LIMIT (10MB) */
    if (file.size > 10 * 1024 * 1024) {
      throw new Error("File too large (max 10MB)");
    }

    /* ❌ TYPE CHECK (PDF ONLY) */
    if (file.mimetype !== "application/pdf") {
      throw new Error("Only PDF files allowed");
    }

    /* 🔥 SAFE NAME */
    const fileName = generateFileName(file.originalname);

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `materials/${fileName}`,
      Body: file.buffer,
      ContentType: file.mimetype,

      /* 🔐 ACCESS CONTROL */
      ACL: "public-read", // or "private" if needed
    };

    const data = await s3.upload(params).promise();

    return {
      url: data.Location,
      key: data.Key,
    };

  } catch (error) {
    console.error("❌ S3 Upload Error:", error.message);
    throw error;
  }
};