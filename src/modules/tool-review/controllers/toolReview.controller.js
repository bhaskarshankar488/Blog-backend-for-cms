import mongoose from "mongoose";
import { ToolReview } from "../../../models/toolReview.model.js";
import { Tool } from "../../../models/tool.model.js";
import {
    successResponse,
    errorResponse,
} from "../../../utils/responseHandler.js";

export const createToolReview = async (req, res) => {
    try {
        const { toolId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.publicAuth.userId;

        // Validate toolId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(toolId)) {
            return errorResponse(res, "Invalid tool ID", 400);
        }

        const checkToolExist = await Tool.findOne({ _id: toolId });
        if (!checkToolExist) {
            return errorResponse(res, "Tool does not exist", 404);
        }

        // Check if user already reviewed this tool
        const existing = await ToolReview.findOne({ toolId, userId });
        if (existing) {
            return errorResponse(
                res,
                "You have already submitted a review for this tool",
                409
            );
        }

        const review = await ToolReview.create({
            userId,
            toolId,
            rating,
            comment,
        });

        return successResponse(res, "Review submitted successfully", {}, 201);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to submit review", 500);
    }
};

export const updateToolReview = async (req, res) => {
    try {
        const { toolId } = req.params;
        const { rating, comment } = req.body;
        const userId = req.publicAuth.userId;

        if (!mongoose.Types.ObjectId.isValid(toolId)) {
            return errorResponse(res, "Invalid tool ID", 400);
        }

        // Check if user already reviewed this tool
        const review = await ToolReview.findOneAndUpdate(
            { toolId, userId },
            { rating, comment },
            {
                new: true,
                runValidators: true,
            }
        ).populate("userId", "displayName avatarUrl");

        if (!review) {
            return errorResponse(res, "Review does not exist", 404);
        }

        const response = {
            id: review._id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            user: {
                id: review.userId._id,
                name: review.userId.displayName,
                profilePicture: review.userId.avatarUrl,
            },
        };

        return successResponse(res, "Review updated successfully", response, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to update review", 500);
    }
};

export const getToolReviews = async (req, res) => {
    try {
        const { toolId } = req.params;

        if (!mongoose.Types.ObjectId.isValid(toolId)) {
            return errorResponse(res, "Invalid tool ID", 400);
        }

        //run parallel db operation to fetch reviews and stats
        const [toolReviews, reviewStats] = await Promise.all([
            ToolReview.find({ toolId })
                .populate("userId", "displayName avatarUrl")
                .sort({ createdAt: -1 })
                .lean(),

            ToolReview.aggregate([
                {
                    $match: {
                        toolId: new mongoose.Types.ObjectId(toolId),
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: "$rating" },
                        totalReviews: { $sum: 1 },
                    },
                },
            ]),
        ]);

        const transformedReviews = toolReviews.map(review => ({
            id: review._id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            user: {
                id: review.userId._id,
                name: review.userId.displayName,
                profilePicture: review.userId.avatarUrl,
            },
        }));

        const response = {
            averageRating: reviewStats[0]?.averageRating ?? 0,
            totalReviews: reviewStats[0]?.totalReviews ?? 0,
            reviews: transformedReviews,
        };

        return successResponse(res, "Tool reviews fetched successfully", response, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to fetch tool reviews", 500);
    }
};
