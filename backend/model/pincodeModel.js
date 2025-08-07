import mongoose from "mongoose";

const pincodeSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true,
        unique: true,
        match: /^\d{6}$/
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    serviceable: {
        type: Boolean,
        default: true
    },
    deliveryDays: {
        type: Number,
        default: 3
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const pincodeModel = mongoose.models.pincode || mongoose.model("pincode", pincodeSchema);

export default pincodeModel;
