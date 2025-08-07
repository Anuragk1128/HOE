import pincodeModel from "../model/pincodeModel.js";

/**
 * @swagger
 * /api/pincode/check:
 *   post:
 *     summary: Check if a pincode is serviceable
 *     tags: [Pincode]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pincode
 *             properties:
 *               pincode:
 *                 type: string
 *                 example: "110001"
 *     responses:
 *       200:
 *         description: Pincode check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 serviceable:
 *                   type: boolean
 *                 city:
 *                   type: string
 *                 state:
 *                   type: string
 *                 deliveryDays:
 *                   type: number
 *                 message:
 *                   type: string
 */
// Check if pincode is serviceable
const checkPincode = async (req, res) => {
    try {
        const { pincode } = req.body;

        if (!pincode) {
            return res.status(400).json({
                success: false,
                message: "Pincode is required"
            });
        }

        // Validate pincode format (6 digits)
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                serviceable: false,
                message: "Please enter a valid 6-digit pincode"
            });
        }

        // Check if pincode exists in database
        const pincodeData = await pincodeModel.findOne({ pincode });

        if (pincodeData && pincodeData.serviceable) {
            return res.json({
                success: true,
                serviceable: true,
                pincode: pincode,
                city: pincodeData.city,
                state: pincodeData.state,
                deliveryDays: pincodeData.deliveryDays,
                message: `Great! We deliver to ${pincodeData.city}, ${pincodeData.state} in ${pincodeData.deliveryDays} days`
            });
        } else {
            return res.json({
                success: true,
                serviceable: false,
                pincode: pincode,
                message: "Sorry, we do not deliver to this pincode yet"
            });
        }

    } catch (error) {
        console.error("Pincode check error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * @swagger
 * /api/pincode/add:
 *   post:
 *     summary: Add a new serviceable pincode (Admin)
 *     tags: [Pincode]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - pincode
 *               - city
 *               - state
 *             properties:
 *               pincode:
 *                 type: string
 *                 example: "110001"
 *               city:
 *                 type: string
 *                 example: "New Delhi"
 *               state:
 *                 type: string
 *                 example: "Delhi"
 *               deliveryDays:
 *                 type: number
 *                 example: 3
 *     responses:
 *       200:
 *         description: Pincode added successfully
 */
// Add new serviceable pincode (admin only)
const addPincode = async (req, res) => {
    try {
        const { pincode, city, state, deliveryDays = 3 } = req.body;

        if (!pincode || !city || !state) {
            return res.status(400).json({
                success: false,
                message: "Pincode, city, and state are required"
            });
        }

        // Validate pincode format
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({
                success: false,
                message: "Please enter a valid 6-digit pincode"
            });
        }

        // Check if pincode already exists
        const existingPincode = await pincodeModel.findOne({ pincode });
        if (existingPincode) {
            return res.status(400).json({
                success: false,
                message: "Pincode already exists"
            });
        }

        const newPincode = new pincodeModel({
            pincode,
            city,
            state,
            deliveryDays,
            serviceable: true
        });

        await newPincode.save();

        return res.json({
            success: true,
            message: "Pincode added successfully",
            data: newPincode
        });

    } catch (error) {
        console.error("Add pincode error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * @swagger
 * /api/pincode/all:
 *   get:
 *     summary: Get all serviceable pincodes (Admin)
 *     tags: [Pincode]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all pincodes
 */
// Get all serviceable pincodes (admin only)
const getAllPincodes = async (req, res) => {
    try {
        const pincodes = await pincodeModel.find({ serviceable: true }).sort({ pincode: 1 });
        
        return res.json({
            success: true,
            count: pincodes.length,
            data: pincodes
        });

    } catch (error) {
        console.error("Get pincodes error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

/**
 * @swagger
 * /api/pincode/{pincode}:
 *   delete:
 *     summary: Delete a pincode (Admin)
 *     tags: [Pincode]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pincode
 *         required: true
 *         schema:
 *           type: string
 *         description: The pincode to delete
 *     responses:
 *       200:
 *         description: Pincode deleted successfully
 */
// Delete pincode (admin only)
const deletePincode = async (req, res) => {
    try {
        const { pincode } = req.params;

        const deletedPincode = await pincodeModel.findOneAndDelete({ pincode });
        
        if (!deletedPincode) {
            return res.status(404).json({
                success: false,
                message: "Pincode not found"
            });
        }

        return res.json({
            success: true,
            message: "Pincode deleted successfully"
        });

    } catch (error) {
        console.error("Delete pincode error:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { checkPincode, addPincode, getAllPincodes, deletePincode };
