const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema(
    {
        studentName: {
            type: String,
            required: true,
            trim: true
        },

        courseName: {
            type: String,
            required: true,
            trim: true
        },

        message: {
            type: String,
            required: true,
            trim: true
        },

        rating: {
            type: Number,
            required: true
        },

        reviewStatus: {
            type: String,
            enum: ["Pending", "Reviewed"],
            default: "Pending"
        }
    },
    {
        timestamps: true
    }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);

module.exports = Feedback;