import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import errorMiddleware from "./middleware/errorMiddleware.js";

/* 🔹 ROUTES */
import authRoutes from "./routes/authRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

/* 🔐 ADMIN ROUTES */
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

/* =====================================
   🔐 SECURITY
===================================== */

app.use(helmet());

/* =====================================
   🌍 CORS
===================================== */

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

/* =====================================
   🚦 GLOBAL RATE LIMIT
===================================== */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
});

app.use(limiter);

/* =====================================
   📄 LOGGER
===================================== */

app.use(morgan("dev"));

/* =====================================
   ⚠️ RAZORPAY WEBHOOK (RAW BODY)
===================================== */

app.post(
  "/api/webhook/razorpay",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("🔔 Razorpay Webhook Hit");
    res.status(200).json({ status: "ok" });
  }
);

/* =====================================
   📦 BODY PARSER
===================================== */

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =====================================
   📲 OTP RATE LIMIT
===================================== */

const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  message: "Too many OTP requests. Try later.",
});

app.use("/api/otp", otpLimiter);

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
app.use("/api/otp", otpRoutes);
app.use("/api/classes", classRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/materials", materialRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/coupons", couponRoutes);

/* =====================================
   🔐 ADMIN ROUTES
===================================== */

app.use("/api/admin", adminAuthRoutes);   // login
app.use("/api/admin", adminRoutes);       // protected admin routes

/* =====================================
   ❌ 404 HANDLER
===================================== */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

/* =====================================
   🔥 ERROR HANDLER
===================================== */

app.use(errorMiddleware);

export default app;