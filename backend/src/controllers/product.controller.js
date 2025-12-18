import Product from "../models/product.model.js";

// Controller to get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find(); // Fetch all products from the database
    res.status(200).json(products); // Send the products as JSON response
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to get a product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId); // Fetch product by ID
    if (!productId) {
      return res.status(404).json({ message: "Product Not Found" });
    }
    res.status(200).json(product); // Send the product as JSON response
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Controller to create a new product
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock } = req.body;
    const product = new Product({ name, description, price, category, stock });
    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });
  }
};
