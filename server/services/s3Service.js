import s3 from "../config/s3.js";

export const uploadFileToS3 = async (file) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `materials/${Date.now()}-${file.originalname}`,
    Body: file.buffer,
    ContentType: file.mimetype
  };

  const data = await s3.upload(params).promise();

  return data.Location; // file URL
};
