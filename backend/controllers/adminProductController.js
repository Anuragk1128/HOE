import Product from "../model/productModel.js";
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

// Middleware to handle multiple image uploads
export const uploadImages = upload.array('images', 10); // Allow up to 10 images

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (file) => {
    return new Promise((resolve, reject) => {
        console.log('Uploading file to Cloudinary:', file.originalname);
        
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: 'ecommerce-products',
                resource_type: 'auto',
                transformation: [
                    { width: 800, height: 800, crop: 'limit' }, // Resize for optimization
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
 * /api/admin/products/{id}:
 *   get:
 *     summary: Get product by ID (Admin)
 *     tags: [Admin Products]
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
 *         description: Product details
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product fetched successfully",
            product: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/products:
 *   get:
 *     summary: Get all products (Admin)
 *     tags: [Admin Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all products
 *       401:
 *         description: Unauthorized
 */
export const getAllProducts = async (req, res) => {
    try {
        const products = await Product.find({}).sort({ createdAt: -1 });
        
        res.status(200).json({
            message: "Products fetched successfully",
            products: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/products:
 *   post:
 *     summary: Create new product (Admin)
 *     tags: [Admin Products]
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
 *               - price
 *               - description
 *               - images
 *               - category
 *               - stock
 *               - sizes
 *               - colors
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               description:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: file
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *               sizes:
 *                 type: array
 *                 items:
 *                   type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *               rating:
 *                 type: number
 *               reviews:
 *                 type: array
 *               isFeatured:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
export const createProduct = async (req, res) => {
    try {
        const {
            name,
            price,
            description,
            category,
            subcategory,
            brand,
            gender,
            stock,
            sizes,
            colors,
            rating,
            reviews = [],
            isFeatured = false,
            isActive = true,
            // Jewellery specific attributes
            metalType,
            purity,
            stoneType,
            stoneQuality,
            weight,
            designStyle,
            // Sportswear specific attributes
            material,
            fitType,
            activityType
        } = req.body;

        // Upload images to Cloudinary
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            try {
                for (const file of req.files) {
                    const cloudinaryUrl = await uploadToCloudinary(file);
                    imageUrls.push(cloudinaryUrl);
                }
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: "Failed to upload images to Cloudinary" });
            }
        }

        // Validate required fields
        if (!name || !price || !description || !category || !subcategory || !brand || !gender || !stock || !rating) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Validate sizes and colors only for sportswear
        if (category === 'sportswear') {
            if (!sizes || sizes.length === 0) {
                return res.status(400).json({ message: "Sizes are required for sportswear products" });
            }
            if (!colors || colors.length === 0) {
                return res.status(400).json({ message: "Colors are required for sportswear products" });
            }
        }

        // Validate that images were uploaded
        if (imageUrls.length === 0) {
            return res.status(400).json({ message: "At least one product image is required" });
        }

        // Parse arrays from form data
        const sizeArray = category === 'sportswear' ? (Array.isArray(sizes) ? sizes : [sizes]) : [];
        const colorArray = category === 'sportswear' ? (Array.isArray(colors) ? colors : [colors]) : [];
        const reviewsArray = Array.isArray(reviews) ? reviews : [];

        // Prepare category-specific attributes
        const productData = {
            name,
            price: Number(price),
            description,
            image: imageUrls,
            category,
            subcategory,
            brand,
            gender,
            stock: Number(stock),
            size: sizeArray,
            color: colorArray,
            rating: Number(rating),
            reviews: reviewsArray,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isActive: isActive === 'true' || isActive === true
        };

        // Add category-specific attributes
        if (category === 'jewellery') {
            productData.jewelleryAttributes = {
                metalType: metalType || null,
                purity: purity || null,
                stoneType: stoneType || null,
                stoneQuality: stoneQuality || null,
                weight: weight ? Number(weight) : null,
                designStyle: designStyle || null,
            };
        } else if (category === 'sportswear') {
            productData.sportswearAttributes = {
                material: material || null,
                fitType: fitType || null,
                activityType: activityType || null,
            };
        }

        const product = await Product.create(productData);

        res.status(201).json({
            message: "Product created successfully",
            product: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/products/{id}:
 *   put:
 *     summary: Update product (Admin)
 *     tags: [Admin Products]
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
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const {
            name,
            price,
            description,
            category,
            subcategory,
            brand,
            gender,
            stock,
            sizes,
            colors,
            rating,
            reviews = [],
            isFeatured = false,
            isActive = true,
            removedImages = [], // Array of image URLs to remove
            // Jewellery specific attributes
            metalType,
            purity,
            stoneType,
            stoneQuality,
            weight,
            designStyle,
            // Sportswear specific attributes
            material,
            fitType,
            activityType
        } = req.body;

        // Upload new images to Cloudinary if provided
        const imageUrls = [];
        if (req.files && req.files.length > 0) {
            try {
                for (const file of req.files) {
                    const cloudinaryUrl = await uploadToCloudinary(file);
                    imageUrls.push(cloudinaryUrl);
                }
            } catch (uploadError) {
                console.error('Cloudinary upload error:', uploadError);
                return res.status(500).json({ message: "Failed to upload images to Cloudinary" });
            }
        }

        // Validate required fields
        if (!name || !price || !description || !category || !subcategory || !brand || !gender || !stock || !rating) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        // Validate sizes and colors only for sportswear
        if (category === 'sportswear') {
            if (!sizes || sizes.length === 0) {
                return res.status(400).json({ message: "Sizes are required for sportswear products" });
            }
            if (!colors || colors.length === 0) {
                return res.status(400).json({ message: "Colors are required for sportswear products" });
            }
        }

        // Parse arrays from form data
        const sizeArray = category === 'sportswear' ? (Array.isArray(sizes) ? sizes : [sizes]) : [];
        const colorArray = category === 'sportswear' ? (Array.isArray(colors) ? colors : [colors]) : [];
        const reviewsArray = Array.isArray(reviews) ? reviews : [];

        // Prepare update data
        const updateData = {
            name,
            price: Number(price),
            description,
            category,
            subcategory,
            brand,
            gender,
            stock: Number(stock),
            size: sizeArray,
            color: colorArray,
            rating: Number(rating),
            reviews: reviewsArray,
            isFeatured: isFeatured === 'true' || isFeatured === true,
            isActive: isActive === 'true' || isActive === true,
            updatedAt: Date.now()
        };

        // Add new images if uploaded
        if (imageUrls.length > 0) {
            updateData.image = imageUrls;
        }

        // Remove images that were explicitly requested to be removed
        if (removedImages && removedImages.length > 0) {
            let removedImagesArray = removedImages;
            // If removedImages is a string (JSON), parse it
            if (typeof removedImages === 'string') {
                try {
                    removedImagesArray = JSON.parse(removedImages);
                } catch (error) {
                    console.error('Error parsing removedImages:', error);
                    removedImagesArray = [];
                }
            }
            
            // Get current product to access existing images
            const currentProduct = await Product.findById(id);
            if (currentProduct) {
                // Filter out removed images from existing images
                const remainingImages = currentProduct.image.filter(
                    (url) => !removedImagesArray.includes(url)
                );
                
                // Combine remaining images with new images
                const finalImages = [...remainingImages, ...imageUrls];
                
                // Check if at least one image will remain
                if (finalImages.length === 0) {
                    return res.status(400).json({ message: "At least one product image is required" });
                }
                
                updateData.image = finalImages;
            }
        } else if (imageUrls.length > 0) {
            // If no images were removed but new ones were added, combine with existing
            const currentProduct = await Product.findById(id);
            if (currentProduct) {
                updateData.image = [...currentProduct.image, ...imageUrls];
            }
        }

        // Add category-specific attributes
        if (category === 'jewellery') {
            updateData.jewelleryAttributes = {
                metalType: metalType || null,
                purity: purity || null,
                stoneType: stoneType || null,
                stoneQuality: stoneQuality || null,
                weight: weight ? Number(weight) : null,
                designStyle: designStyle || null,
            };
        } else if (category === 'sportswear') {
            updateData.sportswearAttributes = {
                material: material || null,
                fitType: fitType || null,
                activityType: activityType || null,
            };
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product updated successfully",
            product: product
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/products/{id}:
 *   delete:
 *     summary: Delete product (Admin)
 *     tags: [Admin Products]
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
 *         description: Product deleted successfully
 *       404:
 *         description: Product not found
 *       401:
 *         description: Unauthorized
 */
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json({
            message: "Product deleted successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/products/categories:
 *   get:
 *     summary: Get all product categories (Admin)
 *     tags: [Admin Products]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all categories
 *       401:
 *         description: Unauthorized
 */
export const getCategories = async (req, res) => {
    try {
        const categories = await Product.distinct('category');
        
        res.status(200).json({
            message: "Categories fetched successfully",
            categories: categories
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 