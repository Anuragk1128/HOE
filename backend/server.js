import express from "express";
import cors from "cors";
import 'dotenv/config';
import swaggerUi from 'swagger-ui-express';
import connectDB from "./config/mongodb.js";
import userRouter from "./routes/userRoute.js";
import adminRouter from "./routes/adminRoute.js";
import adminProductRouter from "./routes/adminProductRoute.js";
import adminWebsiteImageRouter from "./routes/adminWebsiteImageRoute.js";
import websiteImageRouter from "./routes/websiteImageRoute.js";
import productRouter from "./routes/productRoute.js";
import specs from "./swagger.js";

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB().catch(console.error);

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        message: "Server is running",
        timestamp: new Date().toISOString()
    });
});

// Test endpoint to check environment variables
app.get("/test-config", (req, res) => {
    const config = {
        mongodb_uri: process.env.MONGODB_URI ? "Set" : "Not Set",
        jwt_secret: process.env.JWT_SECRET ? "Set" : "Not Set",
        cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Not Set",
        node_env: process.env.NODE_ENV || "Not Set",
        port: process.env.PORT || "Not Set"
    };
    res.json(config);
});

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "House of Evolve API Documentation"
}));

//api endpoints
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);
app.use("/api/admin", adminProductRouter);
app.use("/api/admin", adminWebsiteImageRouter);
app.use("/api", websiteImageRouter);
app.use("/api", productRouter);

app.get("/", (req, res) => {
    res.send("Api is working");
});

// ✅ Correct closing of app.listen
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Documentation available at: http://localhost:${PORT}/api-docs`);
});
