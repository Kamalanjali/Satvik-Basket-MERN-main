import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";

import User from "./models/user.model.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import orderRoutes from "./routes/order.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://your-frontend.vercel.app",
];
// Enable CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);


// Middleware to parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/payments", paymentRoutes);

//error handler middleware
import errorHandler from "./middleware/error.middleware.js";
app.use(errorHandler);

// Root Check
app.get("/", (req, res) => {
  res.send("Server is running");
});


const startServer = async () => {
  try {
    await connectDB(); // ✅ WAIT for DB connection

    //Server starts only after DB connection is successful
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Server failed to start", err);
    process.exit(1);
  }
};

startServer();