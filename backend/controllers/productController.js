import Product from "../model/productModel.js";

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all active products (Public)
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all active products
 *       500:
 *         description: Internal server error
 */
export const getPublicProducts = async (req, res) => {
    try {
        const { category, search, sort = 'name', limit } = req.query;
        
        let query = { isActive: true };
        
        // Filter by category if provided
        if (category && category !== 'all') {
            query.category = category;
        }
        
        // Search functionality
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } }
            ];
        }
        
        // Build sort object
        let sortObj = {};
        switch (sort) {
            case 'price-low':
                sortObj = { price: 1 };
                break;
            case 'price-high':
                sortObj = { price: -1 };
                break;
            case 'name':
            default:
                sortObj = { name: 1 };
                break;
        }
        
        // Build query with limit
        let productQuery = Product.find(query).sort(sortObj);
        if (limit) {
            productQuery = productQuery.limit(parseInt(limit));
        }
        
        const products = await productQuery;
        
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
 * /api/products/{id}:
 *   get:
 *     summary: Get product by ID (Public)
 *     tags: [Products]
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
 *       500:
 *         description: Internal server error
 */
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        
        const product = await Product.findOne({ _id: id, isActive: true });
        
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
 * /api/products/category/{category}:
 *   get:
 *     summary: Get products by category (Public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of products in category
 *       500:
 *         description: Internal server error
 */
export const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const { sort = 'name' } = req.query;
        
        let sortObj = {};
        switch (sort) {
            case 'price-low':
                sortObj = { price: 1 };
                break;
            case 'price-high':
                sortObj = { price: -1 };
                break;
            case 'name':
            default:
                sortObj = { name: 1 };
                break;
        }
        
        const products = await Product.find({ 
            category: category, 
            isActive: true 
        }).sort(sortObj);
        
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
 * /api/products/search/{query}:
 *   get:
 *     summary: Search products (Public)
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: query
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Search results
 *       500:
 *         description: Internal server error
 */
export const searchProducts = async (req, res) => {
    try {
        const { query } = req.params;
        const { sort = 'name' } = req.query;
        
        let sortObj = {};
        switch (sort) {
            case 'price-low':
                sortObj = { price: 1 };
                break;
            case 'price-high':
                sortObj = { price: -1 };
                break;
            case 'name':
            default:
                sortObj = { name: 1 };
                break;
        }
        
        const products = await Product.find({
            isActive: true,
            $or: [
                { name: { $regex: query, $options: 'i' } },
                { description: { $regex: query, $options: 'i' } },
                { category: { $regex: query, $options: 'i' } }
            ]
        }).sort(sortObj);
        
        res.status(200).json({
            message: "Search results fetched successfully",
            products: products
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 