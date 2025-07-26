const mongoose = require("mongoose");

const PostcardsSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            default: "Someone",
            required: true,
        },
        location: {
            type: String,
            max: 20,
            default: "Somewhere",
            required: true,
        },
        message: {
            type: String,
            max: 500,
            default: "Default message",
            required: true,
        },
        imageUrl: {
            type: String,
            max: 500,
            default: "https://placehold.co/500x300",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Postcards", PostcardsSchema);
