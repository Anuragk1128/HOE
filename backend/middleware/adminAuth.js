import jwt from 'jsonwebtoken';
import adminModel from '../model/adminModel.js';

const adminAuth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({ message: 'Access denied. No token provided.' });
        }

        if (!process.env.JWT_SECRET) {
            return res.status(500).json({ message: 'Server configuration error.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await adminModel.findById(decoded.id).select('-password');
        
        if (!admin) {
            return res.status(401).json({ message: 'Invalid token.' });
        }

        req.user = admin;
        next();
    } catch (error) {
        console.log("AdminAuth error:", error.message);
        res.status(401).json({ message: 'Invalid token.' });
    }
};

export default adminAuth; 