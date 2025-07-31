import express from "express";
import { getPublicProducts, getProductById, getProductsByCategory, searchProducts } from "../controllers/productController.js";

const productRouter = express.Router();

// Public product routes (no authentication required)
productRouter.get("/products", getPublicProducts);
productRouter.get("/products/:id", getProductById);
productRouter.get("/products/category/:category", getProductsByCategory);
productRouter.get("/products/search/:query", searchProducts);

export default productRouter; 