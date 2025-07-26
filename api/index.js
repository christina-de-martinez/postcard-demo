const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const postcardsRoute = require("./routes/postcards");

const app = express();
app.use(
    cors({
        origin: ["http://localhost:8008", "http://localhost:5173"],
    })
);
dotenv.config();

const PORT = process.env.PORT || 8008;

// middleware
app.use(express.json());
app.use(helmet());

let isConnected = false;

const connectDB = async () => {
    if (isConnected) {
        console.log("Using existing database connection");
        return;
    }

    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            bufferCommands: false,
            maxPoolSize: 1,
        });
        isConnected = conn.connections[0].readyState;
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log("Database connection error:", error);
        throw error;
    }
};

// Middleware to ensure database connection before handling requests
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        res.status(500).json({ error: "Database connection failed" });
    }
});

// api routes
app.use("/api/v1/postcards", postcardsRoute);

// Export the app for Vercel
module.exports = app;
