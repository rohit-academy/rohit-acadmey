import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import errorMiddleware from "./middleware/errorMiddleware.js";

/* 🔹 ROUTES */
import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import streamRoutes from "./routes/streamRoutes.js"; // 🔥 NEW
import subjectRoutes from "./routes/subjectRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

/* 🔐 ADMIN */
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

/* =====================================
   🔐 TRUST PROXY (RENDER / VERCEL FIX)
===================================== */
app.set("trust proxy", 1);

/* =====================================
   🔐 SECURITY (HELMET HARDENED)
===================================== */
app.use(
  helmet({
    crossOriginResourcePolicy: false, // 🔥 allow images/pdf
  })
);

/* =====================================
   🌍 CORS (SMART + SAFE)
===================================== */
const allowedOrigins = [
  "https://rohitacademy.net",
  "https://www.rohitacademy.net",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      if (origin.includes(".vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.warn("❌ CORS Blocked:", origin);
      return callback(new Error("CORS blocked"));
    },
    credentials: true,
  })
);

/* =====================================
   🚦 RATE LIMIT (GLOBAL)
===================================== */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, try again later",
  },
});

app.use("/api", limiter);

/* =====================================
   📄 LOGGER
===================================== */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =====================================
   ⚠️ WEBHOOK (RAW BODY FIRST)
===================================== */
app.post(
  "/api/webhook/razorpay",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("🔔 Razorpay Webhook Hit");
    res.status(200).json({ success: true });
  }
);

/* =====================================
   📦 BODY PARSER
===================================== */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

/* =====================================
   ❤️ HEALTH CHECK
===================================== */
app.get("/", (req, res) => {
  res.send("🚀 Rohit Academy API Running...");
});

/* =====================================
   🔹 API ROUTES
===================================== */
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/streams", streamRoutes); // 🔥 NEW (IMPORTANT)
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

/* =====================================
   🔐 ADMIN ROUTES
===================================== */
app.use("/api/admin", adminAuthRoutes);
app.use("/api/admin", adminRoutes);

/* =====================================
   ❌ 404 HANDLER
===================================== */
app.use((req, res) => {
  console.warn("❌ 404:", req.method, req.originalUrl);

  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* =====================================
   🔥 GLOBAL ERROR HANDLER (FINAL)
===================================== */
app.use((err, req, res, next) => {
  console.error("💥 ERROR:", err.stack || err.message);

  /* 🔥 MONGOOSE ERRORS */
  if (err.name === "CastError") {
    return res.status(400).json({
      success: false,
      message: "Invalid ID format",
    });
  }

  if (err.code === 11000) {
    return res.status(400).json({
      success: false,
      message: "Duplicate field value",
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;