const mongoose = require("mongoose");
const Feedback = require("../models/feedback");


const createFeedback = async (req, res) => {
    try {
        const {
            studentName,
            courseName,
            message,
            rating
        } = req.body;

        if (!studentName || !courseName || !message || rating === undefined) {
            return res.status(400).json({
                success: false,
                message: "studentName, courseName, message and rating are required"
            });
        }

        if (rating < 1 || rating > 5) {
            return res.status(400).json({
                success: false,
                message: "Rating must be between 1 and 5"
            });
        }

        const feedback = await Feedback.create({
            studentName,
            courseName,
            message,
            rating
        });

        return res.status(201).json({
            success: true,
            message: "Feedback submitted successfully",
            data: feedback
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to submit feedback",
            error: error.message
        });
    }
};


const getFeedback = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        if (isNaN(page) || page < 1) {
            return res.status(400).json({
                success: false,
                message: "Page must be a positive number"
            });
        }

        if (isNaN(limit) || limit < 1) {
            return res.status(400).json({
                success: false,
                message: "Limit must be a positive number"
            });
        }

        const skip = (page - 1) * limit;

        const feedback = await Feedback
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalRecords = await Feedback.countDocuments();

        return res.status(200).json({
            success: true,
            currentPage: page,
            limit: limit,
            totalRecords: totalRecords,
            data: feedback
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve feedback",
            error: error.message
        });
    }
};

const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { reviewStatus } = req.body;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid feedback ID"
            });
        }

        if (!reviewStatus) {
            return res.status(400).json({
                success: false,
                message: "reviewStatus is required"
            });
        }

        if (!["Pending", "Reviewed"].includes(reviewStatus)) {
            return res.status(400).json({
                success: false,
                message: "reviewStatus must be either Pending or Reviewed"
            });
        }

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            {
                reviewStatus
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!feedback) {
            return res.status(404).json({
                success: false,
                message: "Feedback record not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review status updated successfully",
            data: feedback
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Failed to update review status",
            error: error.message
        });
    }
};


module.exports = {
    createFeedback,
    getFeedback,
    updateFeedbackStatus
};