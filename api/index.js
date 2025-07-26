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

// api routes
app.use("/api/v1/postcards", postcardsRoute);

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

//Connect to the database before listening
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log("listening for requests");
    });
});
