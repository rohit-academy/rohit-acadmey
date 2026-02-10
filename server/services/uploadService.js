import cloudinary from "../config/cloudinary.js";

export const uploadPDF = (buffer, name) =>
  new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "rohit-academy",
        public_id: name,
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result.secure_url);
      }
    ).end(buffer);
  });
