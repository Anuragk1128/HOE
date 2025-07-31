import WebsiteImage from "../model/websiteImageModel.js";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";

// Configure multer for memory storage
const upload = multer({ 
    storage: multer.memoryStorage(),
    fileFilter: function (req, file, cb) {
        // Accept only image files
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Middleware to handle single image upload
export const uploadImage = upload.single('image');

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        console.log('Uploading website image to Cloudinary:', file.originalname);
        
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'ecommerce-website-images',
                resource_type: 'auto',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' }, // Resize for optimization
                    { quality: 'auto' } // Auto quality optimization
                ]
            },
            (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                } else {
                    console.log('Successfully uploaded to Cloudinary:', result.secure_url);
                    resolve(result.secure_url);
                }
            }
        );

        stream.end(file.buffer);
    });
};

/**
 * @swagger
 * /api/admin/website-images:
 *   get:
 *     summary: Get all website images (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all website images
 *       401:
 *         description: Unauthorized
 */
export const getAllWebsiteImages = async (req, res) => {
    try {
        const images = await WebsiteImage.find({}).sort({ order: 1, createdAt: -1 });
        
        res.status(200).json({
            message: "Website images fetched successfully",
            images: images
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/website-images:
 *   post:
 *     summary: Create new website image (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *               - image
 *               - altText
 *             properties:
 *               name:
 *                 type: string
 *               type:
 *                 type: string
 *                 enum: [hero, category, logo, banner, team, about, sustainability, careers, contact, shipping, payment]
 *               category:
 *                 type: string
 *               image:
 *                 type: file
 *               altText:
 *                 type: string
 *               description:
 *                 type: string
 *               isActive:
 *                 type: boolean
 *               isFeatured:
 *                 type: boolean
 *               order:
 *                 type: number
 *     responses:
 *       201:
 *         description: Website image created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const createWebsiteImage = async (req, res) => {
    try {
        const {
            name,
            type,
            category,
            altText,
            description,
            isActive = true,
            isFeatured = false,
            order = 0
        } = req.body;

        // Upload image to Cloudinary
        let imageUrl = "";
        if (req.file) {
            try {
                imageUrl = await uploadToCloudinary(req.file);
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
            }
        }

        // Validate required fields
        if (!name || !type || !altText) {
            return res.status(400).json({ message: "Name, type, and alt text are required" });
        }

        // Validate that image was uploaded
        if (!imageUrl) {
            return res.status(400).json({ message: "Image is required" });
        }

        // Validate type enum
        const validTypes = ['hero', 'category', 'logo', 'banner', 'team', 'about', 'sustainability', 'careers', 'contact', 'shipping', 'payment'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ message: "Invalid image type" });
        }

        const websiteImage = await WebsiteImage.create({
            name,
            type,
            category: category || null,
            imageUrl,
            altText,
            description: description || "",
            isActive: isActive === 'true' || isActive === true,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            order: Number(order) || 0
        });

        res.status(201).json({
            message: "Website image created successfully",
            image: websiteImage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/website-images/{id}:
 *   put:
 *     summary: Update website image (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Website image updated successfully
 *       404:
 *         description: Website image not found
 *       401:
 *         description: Unauthorized
 */
export const updateWebsiteImage = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = { ...req.body, updatedAt: Date.now() };

        // If a new image is uploaded, upload it to Cloudinary
        if (req.file) {
            try {
                const imageUrl = await uploadToCloudinary(req.file);
                updateData.imageUrl = imageUrl;
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: "Failed to upload image to Cloudinary" });
            }
        }

        const websiteImage = await WebsiteImage.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!websiteImage) {
            return res.status(404).json({ message: "Website image not found" });
        }

        res.status(200).json({
            message: "Website image updated successfully",
            image: websiteImage
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/website-images/{id}:
 *   delete:
 *     summary: Delete website image (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Website image deleted successfully
 *       404:
 *         description: Website image not found
 *       401:
 *         description: Unauthorized
 */
export const deleteWebsiteImage = async (req, res) => {
    try {
        const { id } = req.params;

        const websiteImage = await WebsiteImage.findByIdAndDelete(id);

        if (!websiteImage) {
            return res.status(404).json({ message: "Website image not found" });
        }

        res.status(200).json({
            message: "Website image deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/website-images/types:
 *   get:
 *     summary: Get all website image types (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all image types
 *       401:
 *         description: Unauthorized
 */
export const getImageTypes = async (req, res) => {
    try {
        const types = [
            { value: 'hero', label: 'Hero Section' },
            { value: 'category', label: 'Category Section' },
            { value: 'logo', label: 'Logo' },
            { value: 'banner', label: 'Banner' },
            { value: 'team', label: 'Team' },
            { value: 'about', label: 'About' },
            { value: 'sustainability', label: 'Sustainability' },
            { value: 'careers', label: 'Careers' },
            { value: 'contact', label: 'Contact' },
            { value: 'shipping', label: 'Shipping' },
            { value: 'payment', label: 'Payment' }
        ];
        
        res.status(200).json({
            message: "Image types fetched successfully",
            types: types
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/website-images/{id}:
 *   get:
 *     summary: Get website image by ID (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Website image details
 *       404:
 *         description: Image not found
 *       401:
 *         description: Unauthorized
 */
export const getWebsiteImageById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const image = await WebsiteImage.findById(id);
        
        if (!image) {
            return res.status(404).json({ message: "Website image not found" });
        }
        
        res.status(200).json({
            message: "Image fetched successfully",
            image: image
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/website-images/by-type/{type}:
 *   get:
 *     summary: Get website images by type (Admin)
 *     tags: [Admin Website Images]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of images by type
 *       401:
 *         description: Unauthorized
 */
export const getImagesByType = async (req, res) => {
    try {
        const { type } = req.params;
        
        const images = await WebsiteImage.find({ type, isActive: true }).sort({ order: 1, createdAt: -1 });
        
        res.status(200).json({
            message: "Images fetched successfully",
            images: images
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 