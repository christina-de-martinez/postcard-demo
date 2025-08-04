const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const postcardsRoute = require("./routes/postcards");

const app = express();
app.use(
    cors({
        origin: [
            "http://localhost:8008",
            "http://localhost:5173",
            "https://postcard-demo-6mg5.vercel.app",
            "https://postcard-demo.vercel.app",
            "https://snailmail.dev",
        ],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
    })
);
dotenv.config();

app.use(express.json());
app.use(helmet());

let isConnected = false;

// ensure there's a connection before proceeding
const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            maxPoolSize: 1,
        });
        isConnected = conn.connections[0].readyState === 1;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Database connection error:", error);
        throw error;
    }
};

app.use(async (req, res, next) => {
    try {
        await connectDB();
        if (mongoose.connection.readyState !== 1) {
            throw new Error("Database not connected");
        }
        next();
    } catch (error) {
        console.error("Database middleware error:", error);
        res.status(500).json({ error: "Database connection failed" });
    }
});

app.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "Server is running" });
});
app.use("/api/v1/postcards", postcardsRoute);

// For local development - only start server if this file is run directly
if (require.main === module) {
    const PORT = process.env.PORT || 8008;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Health check: http://localhost:${PORT}/health`);
        console.log(`API: http://localhost:${PORT}/api/v1/postcards`);
    });
}

module.exports = app;
