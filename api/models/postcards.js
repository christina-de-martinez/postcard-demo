const mongoose = require("mongoose");

const PostcardsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 1,
            max: 22,
            default: "Someone",
            required: true,
        },
        location: {
            type: String,
            min: 2,
            max: 22,
            default: "Somewhere",
            required: true,
        },
        message: {
            type: String,
            max: 320,
            default: "Default message",
            required: true,
        },
        imageUrl: {
            type: String,
            max: 50,
            default: "https://snailmail.dev/1.jpg",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Postcards", PostcardsSchema);
