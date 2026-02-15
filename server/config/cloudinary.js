import { v2 as cloudinary } from "cloudinary";

/* 🔐 Validate ENV variables */
if (
  !process.env.CLOUDINARY_CLOUD_NAME ||
  !process.env.CLOUDINARY_API_KEY ||
  !process.env.CLOUDINARY_API_SECRET
) {
  console.error("❌ Cloudinary ENV variables missing");
  process.exit(1); // stop server if config missing
}

/* ☁️ Cloudinary Config */
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true
});

/* 🧪 Test function (optional use in startup) */
export const testCloudinaryConnection = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("☁️ Cloudinary Connected:", result.status);
  } catch (error) {
    console.error("❌ Cloudinary Connection Failed:", error.message);
  }
};

export default cloudinary;
