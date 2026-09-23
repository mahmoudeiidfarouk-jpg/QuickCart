import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;

        if (!mongoURI) {
            throw new Error("MONGODB_URI is not defined");
        }

        await mongoose.connect(mongoURI);

        console.log("MONGODB is connected");
    } catch (error) {
        console.error("MONGODB is connection error", error);
        process.exit(1);
    }
}

export default connectDB;