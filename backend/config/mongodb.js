import mongoose from "mongoose";

const connectDB = async () => {
    try {
        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB');
        });
        await mongoose.connect(`${process.env.MONGODB_URI}/HOE`);
    } catch (error) {
        console.log('MongoDB connection error', error);
    }
};

export default connectDB;