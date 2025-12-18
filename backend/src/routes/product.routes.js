import express from "express";
import { getAllProducts, getProductById, createProduct } from "../controllers/product.controller.js";

const router = express.Router();

// Route to get all products
router.get("/", getAllProducts);

// Route to get a product by ID
router.get("/:id", getProductById);

// Route to create a new product
router.post("/", createProduct);

export default router;