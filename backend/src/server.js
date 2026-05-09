import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import passport from "passport";
import pinoHttp from "pino-http";

import helmet from "helmet";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import mongoose from "mongoose";

import connectDB from "./config/db.js";
import "./config/passport.js";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import errorHandler from "./middleware/error.middleware.js";
import logger from "./utils/logger.js";
import Sentry from "./config/sentry.js";

const app = express();
const PORT = process.env.PORT || 3000;

/* ==================================================
   PROCESS LEVEL ERROR HANDLING
================================================== */

process.on("uncaughtException", (err) => {
  logger.error(err, "UNCAUGHT EXCEPTION");
  process.exit(1);
});

/* ==================================================
   SECURITY MIDDLEWARE
================================================== */

// Secure HTTP headers
app.use(helmet());

// Prevent HTTP Parameter Pollution
app.use(hpp());

/* ==================================================
   RATE LIMITING
================================================== */

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 100,

  message: {
    success: false,
    message:
      "Too many requests from this IP. Please try again later.",
  },

  standardHeaders: true,

  legacyHeaders: false,
});

app.use("/api", limiter);

/* ==================================================
   BODY PARSERS
================================================== */

// JSON parser with payload limit
app.use(
  express.json({
    limit: "10kb",
  })
);

/* ==================================================
   LOGGER
================================================== */

// Request logger
app.use(
  pinoHttp({
    logger,

    redact: [
      "req.headers.authorization",
      "req.headers.cookie",
    ],
  })
);

/* ==================================================
   AUTH
================================================== */

// Passport (JWT strategy only, no sessions)
app.use(passport.initialize());

/* ==================================================
   CORS
================================================== */

const allowedOrigins = [
  "http://localhost:5173",
  "https://satvikbasket.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow Postman / server-to-server requests
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(
        new Error("Not allowed by CORS")
      );
    },

    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],

    credentials: true,
  })
);

/* ==================================================
   ROUTES
================================================== */

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

/* ==================================================
   HEALTH CHECK
================================================== */

app.get("/health", (req, res) => {
  const isDbConnected =
    mongoose.connection.readyState === 1;

  res.status(isDbConnected ? 200 : 503).json({
    success: isDbConnected,
    uptime: process.uptime(),
    database: isDbConnected
      ? "connected"
      : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Satvik Basket API running",
  });
});

/* ==================================================
   404 HANDLER
================================================== */

app.use((req, res, next) => {
  const error = new Error(
    `Route not found: ${req.originalUrl}`
  );

  error.statusCode = 404;

  next(error);
});

/* ==================================================
   GLOBAL ERROR HANDLER
================================================== */

app.use(errorHandler);

/* ==================================================
   START SERVER
================================================== */

const startServer = async () => {
  try {
    await connectDB();

    logger.info("MongoDB connected successfully");

    const server = app.listen(PORT, () => {
      logger.info(
        `🚀 Server running on port ${PORT}`
      );
    });

    /* ----------------------------------------------
       UNHANDLED PROMISE REJECTIONS
    ---------------------------------------------- */

    process.on("unhandledRejection", (err) => {
      logger.error(err, "UNHANDLED REJECTION");

      server.close(() => {
        process.exit(1);
      });
    });

    /* ----------------------------------------------
       GRACEFUL SHUTDOWN
    ---------------------------------------------- */

    process.on("SIGTERM", () => {
      logger.info(
        "SIGTERM received. Shutting down gracefully..."
      );

      server.close(() => {
        logger.info("Process terminated");
      });
    });

  } catch (error) {
    logger.error(error, "Server failed to start");
    process.exit(1);
  }
};

startServer();