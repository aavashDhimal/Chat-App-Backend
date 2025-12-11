import mongoose from "mongoose";

const MONGO_URI = "mongodb://admin:admin123@192.168.49.2:32017";

export const connectDB = async (): Promise<void> => {
    try {
        mongoose.set("strictQuery", true);

        await mongoose.connect(MONGO_URI, {
            autoIndex: true
        });

        console.log("MongoDB connected successfully");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

// Graceful shutdown
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed (SIGINT)");
    process.exit(0);
});

process.on("SIGTERM", async () => {
    await mongoose.connection.close();
    console.log("MongoDB connection closed (SIGTERM)");
    process.exit(0);
});
