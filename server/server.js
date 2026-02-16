import dotenv from "dotenv";
dotenv.config(); // ⭐ SABSE PEHLE

import mongoose from "mongoose";
import app from "./app.js";

/* 🔹 MongoDB Connection */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "rohitacademy", // ✅ FIX: force correct DB
    });

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 DB Name: ${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB runtime error:", err.message);
    });

  } catch (error) {
    console.error("🔴 DB Connection Failed:", error.message);
    process.exit(1);
  }
};

/* 🔹 Unhandled Rejection Safety */
process.on("unhandledRejection", (err) => {
  console.log("💥 UNHANDLED REJECTION! Shutting down...");
  console.log(err.name, err.message);
  process.exit(1);
});

/* 🔹 Start Server */
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
};

startServer();
