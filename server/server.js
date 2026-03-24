import dotenv from "dotenv";
dotenv.config(); // ⭐ FIRST

import mongoose from "mongoose";
import app from "./app.js";

/* =====================================
   🔹 MONGODB CONNECT
===================================== */
const connectDB = async () => {
  try {

    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "rohitacademy",
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

/* =====================================
   🔹 UNCAUGHT EXCEPTION (🔥 ADD)
===================================== */
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

/* =====================================
   🔹 UNHANDLED REJECTION
===================================== */
process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});

/* =====================================
   🔹 START SERVER
===================================== */
const PORT = process.env.PORT || 5000;

let server;

const startServer = async () => {

  await connectDB();

  server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });

};

startServer();

/* =====================================
   🔹 GRACEFUL SHUTDOWN (🔥 IMPORTANT)
===================================== */
const shutdown = async (signal) => {
  console.log(`🛑 ${signal} received. Closing server...`);

  if (server) {
    server.close(() => {
      console.log("🧹 HTTP server closed");
    });
  }

  try {
    await mongoose.connection.close();
    console.log("🧹 MongoDB connection closed");
  } catch (err) {
    console.error("❌ Error closing DB:", err.message);
  }

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);