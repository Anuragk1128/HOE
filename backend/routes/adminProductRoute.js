import express from "express";
import { getAllProducts, createProduct, updateProduct, deleteProduct, getCategories, uploadImages } from "../controllers/adminProductController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminProductRouter = express.Router();

// All routes require admin authentication
adminProductRouter.use(adminAuth);

// Product CRUD operations
adminProductRouter.get("/products", getAllProducts);
adminProductRouter.post("/products", uploadImages, createProduct);
adminProductRouter.put("/products/:id", updateProduct);
adminProductRouter.delete("/products/:id", deleteProduct);

// Categories
adminProductRouter.get("/products/categories", getCategories);

export default adminProductRouter; 