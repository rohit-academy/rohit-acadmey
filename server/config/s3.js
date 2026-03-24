import { S3Client } from "@aws-sdk/client-s3";

/* =====================================
   🔒 ENV CHECK
===================================== */
if (!process.env.AWS_REGION) {
  console.error("❌ AWS_REGION missing");
}

/* =====================================
   ☁️ S3 CONFIG (SMART)
   - IAM role support
   - fallback to env keys
===================================== */
const s3 = new S3Client({
  region: process.env.AWS_REGION,

  ...(process.env.AWS_ACCESS_KEY && process.env.AWS_SECRET_KEY
    ? {
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY,
          secretAccessKey: process.env.AWS_SECRET_KEY,
        },
      }
    : {}) // 🔥 IAM role auto use
});

/* =====================================
   🔍 DEBUG (optional)
===================================== */
if (process.env.NODE_ENV === "development") {
  console.log("☁️ S3 Initialized");
}

export default s3;