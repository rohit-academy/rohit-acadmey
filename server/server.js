import dotenv from "dotenv";
dotenv.config(); // ⭐ ALWAYS FIRST

import mongoose from "mongoose";
import app from "./app.js";

/* =====================================
   🌍 ENV CHECK
===================================== */
if (!process.env.MONGO_URI) {
  console.error("❌ MONGO_URI missing in env");
  process.exit(1);
}

/* =====================================
   🔹 MONGODB CONNECT
===================================== */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "rohitacademy",
    });

    console.log(`🟢 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);

    mongoose.connection.on("error", (err) => {
      console.error("🔴 MongoDB runtime error:", err.message);
    });

  } catch (error) {
    console.error("❌ DB Connection Failed:", error.message);
    process.exit(1);
  }
};

/* =====================================
   🔹 GLOBAL ERROR HANDLING
===================================== */
process.on("uncaughtException", (err) => {
  console.error("💥 UNCAUGHT EXCEPTION! Shutting down...");
  console.error(err.stack || err.message);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("💥 UNHANDLED REJECTION! Shutting down...");
  console.error(err.stack || err.message);
  process.exit(1);
});

/* =====================================
   🚀 START SERVER
===================================== */
const PORT = process.env.PORT || 10000; // Render default

let server;

const startServer = async () => {
  try {
    await connectDB();

    server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌐 Mode: ${process.env.NODE_ENV}`);
    });

  } catch (err) {
    console.error("❌ Server start failed:", err.message);
    process.exit(1);
  }
};

startServer();

/* =====================================
   🛑 GRACEFUL SHUTDOWN
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