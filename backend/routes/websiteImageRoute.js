import express from "express";
import { 
    getAllWebsiteImages, 
    getImagesByType 
} from "../controllers/adminWebsiteImageController.js";

const websiteImageRouter = express.Router();

// Public routes for fetching website images (no authentication required)
websiteImageRouter.get("/website-images", getAllWebsiteImages);
websiteImageRouter.get("/website-images/by-type/:type", getImagesByType);

export default websiteImageRouter; 