import express from "express";
import upload from "../middleware/upload.middleware.js";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProductImageUrl,
} from "../controllers/product.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/role.middleware.js";

const router = express.Router();


// Health Check Route
router.get("/ping", (req, res) => {
  console.log("🔥 /ping hit");
  res.json({ message: "products route alive" });
});

// Route to get all products
router.get("/", getAllProducts);

// Route to get a product by ID
router.get("/:id", getProductById);

// Route to create a new product
router.post("/", protect, adminOnly, createProduct);

// Route to upload product with images
router.put(
  "/:id/image-url",
  protect,
  adminOnly,
  upload.single("image"),
  updateProductImageUrl
);

export default router;
