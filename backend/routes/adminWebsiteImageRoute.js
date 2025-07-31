import express from "express";
import { 
    getAllWebsiteImages, 
    createWebsiteImage, 
    updateWebsiteImage, 
    deleteWebsiteImage, 
    getWebsiteImageById,
    getImageTypes,
    getImagesByType,
    uploadImage 
} from "../controllers/adminWebsiteImageController.js";
import adminAuth from "../middleware/adminAuth.js";

const adminWebsiteImageRouter = express.Router();

// All routes require admin authentication
adminWebsiteImageRouter.use(adminAuth);

// Website image CRUD operations
adminWebsiteImageRouter.get("/website-images", getAllWebsiteImages);
adminWebsiteImageRouter.get("/website-images/:id", getWebsiteImageById);
adminWebsiteImageRouter.post("/website-images", uploadImage, createWebsiteImage);
adminWebsiteImageRouter.put("/website-images/:id", uploadImage, updateWebsiteImage);
adminWebsiteImageRouter.delete("/website-images/:id", deleteWebsiteImage);

// Get image types
adminWebsiteImageRouter.get("/website-images/types", getImageTypes);

// Get images by type
adminWebsiteImageRouter.get("/website-images/by-type/:type", getImagesByType);

export default adminWebsiteImageRouter; 