import dotenv from "dotenv";
dotenv.config(); // ✅ MUST be first

import express from "express";
import cors from "cors";
import passport from "passport";
import cookieParser from "cookie-parser";

import connectDB from "./config/db.js";
import "./config/passport.js"; // now env is already loaded

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

import errorHandler from "./middleware/error.middleware.js";

const app = express();
app.set("trust proxy", 1); // for secure cookies behind proxies
const PORT = process.env.PORT || 3000;

/* ---------------- MIDDLEWARE ---------------- */
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

const allowedOrigins = [
  "http://localhost:5173",
  "https://satvikbasket.vercel.app",
];

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);

/* ---------------- ROUTES ---------------- */
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

/* ---------------- HEALTH ---------------- */
app.get("/", (req, res) => {
  res.send("🚀 Satvik Basket API running");
});

/* ---------------- ERROR ---------------- */
app.use(errorHandler);

/* ---------------- START ---------------- */
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () =>
    console.log(`🚀 Server running on port ${PORT}`)
  );
};

startServer();
