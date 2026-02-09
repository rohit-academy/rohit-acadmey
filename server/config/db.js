import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB runtime error:", err.message);
    });

  } catch (error) {
    console.error(`🔴 Initial DB Connection Failed: ${error.message}`);
    process.exit(1); // Stop server if DB not connected
  }
};

export default connectDB;
