import winston from "winston";

/* 🎨 COLORS FOR CONSOLE */
const colors = {
  info: "green",
  warn: "yellow",
  error: "red",
  debug: "blue",
};

winston.addColors(colors);

/* 🧾 CUSTOM FORMAT */
const logFormat = winston.format.printf(
  ({ timestamp, level, message, stack }) => {
    return stack
      ? `[${timestamp}] ${level.toUpperCase()}: ${message} - ${stack}`
      : `[${timestamp}] ${level.toUpperCase()}: ${message}`;
  }
);

const logger = winston.createLogger({
  level: "info",

  format: winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }), // 🔥 stack trace enable
    logFormat
  ),

  transports: [
    /* 🖥 CONSOLE (COLORED) */
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.timestamp({ format: "HH:mm:ss" }),
        logFormat
      ),
    }),

    /* ❌ ERROR LOG FILE */
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
    }),

    /* 📦 ALL LOG FILE */
    new winston.transports.File({
      filename: "logs/combined.log",
    }),
  ],
});

export default logger;
