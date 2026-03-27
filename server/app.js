import express from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import errorMiddleware from "./middleware/errorMiddleware.js";

/* 🔹 ROUTES */
import authRoutes from "./routes/authRoutes.js";
import classRoutes from "./routes/classRoutes.js";
import subjectRoutes from "./routes/subjectRoutes.js";
import materialRoutes from "./routes/materialRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import couponRoutes from "./routes/couponRoutes.js";

/* 🔐 ADMIN */
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const app = express();

/* =====================================
   🔐 SECURITY
===================================== */
app.use(helmet());

/* =====================================
   🌍 CORS (FINAL FIX)
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

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("❌ Blocked by CORS:", origin);
      return callback(new Error("CORS blocked"));
    },
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
app.use("/api", limiter);

/* =====================================
   📄 LOGGER
===================================== */
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

/* =====================================
   ⚠️ WEBHOOK (RAW FIRST)
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
   ❤️ HEALTH CHECK
===================================== */
app.get("/", (req, res) => {
  res.send("🚀 Rohit Academy API Running...");
});

/* =====================================
   🔹 ROUTES
===================================== */
app.use("/api/auth", authRoutes);
app.use("/api/classes", classRoutes);
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