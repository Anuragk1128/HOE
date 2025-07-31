import mongoose from "mongoose";

const connectDB = async () => {
    try {
        // Check if MONGODB_URI is set
        if (!process.env.MONGODB_URI) {
            console.error("MONGODB_URI environment variable is not set");
            throw new Error("MongoDB URI is not configured");
        }

        // Set mongoose options
        const options = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        mongoose.connection.on('connected', () => {
            console.log('Connected to MongoDB successfully');
        });

        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
        });

        await mongoose.connect(`${process.env.MONGODB_URI}/HOE`, options);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
};

export default connectDB;