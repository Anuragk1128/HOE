import express from "express";
import { userLogin, userRegister, adminLogin, getUserProfile, updateUserProfile, createOrder, getUserOrders } from "../controllers/userController.js";
import auth from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.post("/login", userLogin);
userRouter.post("/register", userRegister);
userRouter.post("/adminlogin", adminLogin);

// Protected routes (require authentication)
userRouter.get("/profile", auth, getUserProfile);
userRouter.put("/profile", auth, updateUserProfile);
userRouter.post("/orders", auth, createOrder);
userRouter.get("/orders", auth, getUserOrders);

export default userRouter;