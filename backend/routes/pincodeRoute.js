import express from "express";
import { checkPincode, addPincode, getAllPincodes, deletePincode } from "../controllers/pincodeController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public endpoint to check pincode
router.post("/check", checkPincode);

// Admin endpoints (protected)
router.post("/add", adminAuth, addPincode);
router.get("/all", adminAuth, getAllPincodes);
router.delete("/:pincode", adminAuth, deletePincode);

export default router;
