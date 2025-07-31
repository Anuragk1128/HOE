import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    address: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    cartData: { type: Object, default: {} },
    orderHistory: [{ 
        items: [Object],
        total: Number,
        date: String,
        orderId: String,
        status: { type: String, default: 'pending' },
        shippingAddress: { type: Object, default: {} },
        paymentMode: { type: String, default: 'cod' }
    }]
}, { minimize: false });

const userModel = mongoose.models.user || mongoose.model("user", userSchema);

export default userModel;