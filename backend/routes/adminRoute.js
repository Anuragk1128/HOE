import express from "express";
import { adminLogin, adminRegister, getAllUsers, getDashboardStats, getAllOrders, updateOrderStatus, verifyToken, logout } from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminRouter = express.Router();

// Admin authentication routes
adminRouter.post("/login", adminLogin);
adminRouter.post("/register", adminRegister);

// Protected admin routes (require authentication)
adminRouter.get("/verify", adminAuth, verifyToken);
adminRouter.post("/logout", adminAuth, logout);
adminRouter.get("/users", adminAuth, getAllUsers);
adminRouter.get("/dashboard", adminAuth, getDashboardStats);
adminRouter.get("/orders", adminAuth, getAllOrders);
adminRouter.put("/orders/:orderId/status", adminAuth, updateOrderStatus);

export default adminRouter; 