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
connectDB();

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
