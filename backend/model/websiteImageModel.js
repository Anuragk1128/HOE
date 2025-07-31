import mongoose from "mongoose";

const websiteImageSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { 
        type: String, 
        required: true,
        enum: ['hero', 'category', 'logo', 'banner', 'team', 'about', 'sustainability', 'careers', 'contact', 'shipping', 'payment']
    },
    category: { type: String, required: false }, // For category-specific images
    imageUrl: { type: String, required: true },
    altText: { type: String, required: true },
    description: { type: String, required: false },
    isActive: { type: Boolean, default: true },
    isFeatured: { type: Boolean, default: false },
    order: { type: Number, default: 0 }, // For ordering images
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const WebsiteImage = mongoose.model("WebsiteImage", websiteImageSchema);

export default WebsiteImage; 