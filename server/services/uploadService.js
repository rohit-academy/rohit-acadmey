import cloudinary from "../config/cloudinary.js";

/* ☁️ Upload PDF → returns url + public_id */
export const uploadPDF = (buffer, fileName) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "rohit-academy/materials",
        public_id: fileName,     // custom name
        overwrite: true,         // 🔁 replace support
      },
      (error, result) => {
        if (error) return reject(error);

        resolve({
          url: result.secure_url,
          public_id: result.public_id,
          bytes: result.bytes,
          format: result.format,
        });
      }
    );

    stream.end(buffer);
  });

/* ❌ Delete PDF from Cloudinary */
export const deletePDF = async (publicId) => {
  if (!publicId) return;

  await cloudinary.uploader.destroy(publicId, {
    resource_type: "raw",
  });
};
