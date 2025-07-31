import adminModel from "../model/adminModel.js";
import userModel from "../model/usermodel.js";
import Product from "../model/productModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken = (id) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not defined");
    }
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * @swagger
 * /api/admin/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Invalid credentials
 */
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        const admin = await adminModel.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, admin.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const token = createToken(admin._id);

        res.status(200).json({
            message: "Login successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/register:
 *   post:
 *     summary: Admin registration
 *     tags: [Admin]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Registration successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *       400:
 *         description: Registration failed
 */
export const adminRegister = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ message: "Please enter a valid email" });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" });
        }

        const existingAdmin = await adminModel.findOne({ email });

        if (existingAdmin) {
            return res.status(400).json({ message: "Admin with this email already exists" });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const admin = await adminModel.create({
            name,
            email,
            password: hashedPassword
        });

        const token = createToken(admin._id);

        res.status(201).json({
            message: "Registration successful",
            token,
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     summary: Get all registered users (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       phone:
 *                         type: string
 *                       address:
 *                         type: string
 *                       city:
 *                         type: string
 *                       country:
 *                         type: string
 *                       orderHistory:
 *                         type: array
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getAllUsers = async (req, res) => {
    try {
        const users = await userModel.find({}).select('-password');
        
        res.status(200).json({
            message: "Users fetched successfully",
            users: users
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/dashboard:
 *   get:
 *     summary: Get admin dashboard stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalUsers:
 *                   type: number
 *                 totalOrders:
 *                   type: number
 *                 totalProducts:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getDashboardStats = async (req, res) => {
    try {
        const totalUsers = await userModel.countDocuments();
        const totalProducts = await Product.countDocuments();
        
        // Calculate total orders from all users
        const users = await userModel.find({});
        let totalOrders = 0;
        
        users.forEach(user => {
            if (user.orderHistory && user.orderHistory.length > 0) {
                totalOrders += user.orderHistory.length;
            }
        });

        res.status(200).json({
            totalUsers,
            totalOrders,
            totalProducts
        });
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
}; 

/**
 * @swagger
 * /api/admin/verify:
 *   get:
 *     summary: Verify admin token
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 admin:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *       401:
 *         description: Invalid token
 */
export const verifyToken = async (req, res) => {
    try {
        // The adminAuth middleware already verified the token and attached the admin to req
        const admin = await adminModel.findById(req.user.id).select('-password');
        
        if (!admin) {
            return res.status(401).json({ message: "Invalid token" });
        }

        res.status(200).json({
            admin: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/logout:
 *   post:
 *     summary: Admin logout
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *       401:
 *         description: Unauthorized
 */
export const logout = async (req, res) => {
    try {
        // In a real application, you might want to blacklist the token
        // For now, we'll just return success as the client will clear the token
        res.status(200).json({ message: "Logout successful" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/orders:
 *   get:
 *     summary: Get all orders (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       items:
 *                         type: array
 *                       total:
 *                         type: number
 *                       date:
 *                         type: string
 *                       status:
 *                         type: string
 *                       orderId:
 *                         type: string
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
export const getAllOrders = async (req, res) => {
    try {
        const users = await userModel.find({});
        const allOrders = [];
        
        users.forEach(user => {
            if (user.orderHistory && user.orderHistory.length > 0) {
                user.orderHistory.forEach(order => {
                    allOrders.push({
                        _id: order._id,
                        userId: user._id,
                        userName: user.name,
                        userEmail: user.email,
                        userPhone: user.phone,
                        items: order.items,
                        total: order.total,
                        date: order.date,
                        status: order.status || 'pending',
                        orderId: order.orderId,
                        shippingAddress: order.shippingAddress || {},
                        paymentMode: order.paymentMode || 'cod'
                    });
                });
            }
        });

        // Sort orders by date (newest first)
        allOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.status(200).json({
            message: "Orders fetched successfully",
            orders: allOrders
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

/**
 * @swagger
 * /api/admin/orders/{orderId}/status:
 *   put:
 *     summary: Update order status (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */
export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: "Status is required" });
        }

        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: "Invalid status" });
        }

        // Find the user who has this order
        const user = await userModel.findOne({
            'orderHistory._id': orderId
        });

        if (!user) {
            return res.status(404).json({ message: "Order not found" });
        }

        // Update the order status
        const result = await userModel.updateOne(
            { 'orderHistory._id': orderId },
            { $set: { 'orderHistory.$.status': status } }
        );

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.status(200).json({
            message: "Order status updated successfully"
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 