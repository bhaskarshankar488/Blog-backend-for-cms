import mongoose from "mongoose";
import { ToolReview } from "../../../models/toolReview.model.js";
import { Tool } from "../../../models/tool.model.js";
import {
    successResponse,
    errorResponse,
} from "../../../utils/responseHandler.js";

export const createToolReview = async (req, res) => {
    try {
        const { toolSlug } = req.params;
        const { rating, comment } = req.body;
        const userId = req.publicAuth.userId;

        if (!toolSlug) {
            return errorResponse(res, "Tool slug is required", 400);
        }

        const checkToolExist = await Tool.findOne({ slug: toolSlug });
        if (!checkToolExist) {
            return errorResponse(res, "Tool not found", 404);
        }

        // Check if user already reviewed this tool
        const existing = await ToolReview.findOne({ toolId: checkToolExist._id, userId });
        if (existing) {
            return errorResponse(
                res,
                "You have already submitted a review for this tool",
                409
            );
        }

        const review = await ToolReview.create({
            userId,
            toolId: checkToolExist._id,
            rating,
            comment,
        });

        await review.populate("userId", "displayName avatarUrl");

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

        return successResponse(res, "Review submitted successfully", response, 201);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to submit review", 500);
    }
};

export const updateToolReview = async (req, res) => {
    try {
        const { toolSlug } = req.params;
        const { rating, comment } = req.body;
        const userId = req.publicAuth.userId;

        if (!toolSlug) {
            return errorResponse(res, "Tool slug is required", 400);
        }

        const checkToolExist = await Tool.findOne({ slug: toolSlug });
        if (!checkToolExist) {
            return errorResponse(res, "Tool not found", 404);
        }

        // Check if user already reviewed this tool
        const updatedReview = await ToolReview.findOneAndUpdate(
            { toolId: checkToolExist._id, userId },
            { rating, comment },
            {
                new: true,
                runValidators: true,
            }
        ).populate("userId", "displayName avatarUrl");

        if (!updatedReview) {
            return errorResponse(res, "Review does not exist", 404);
        }

        const response = {
            id: updatedReview._id,
            rating: updatedReview.rating,
            comment: updatedReview.comment,
            createdAt: updatedReview.createdAt,
            user: {
                id: updatedReview.userId._id,
                name: updatedReview.userId.displayName,
                profilePicture: updatedReview.userId.avatarUrl,
            },
        };

        return successResponse(res, "Review updated successfully", response, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to update review", 500);
    }
};

export const getToolReviews = async (req, res) => {
    try {
        const { toolSlug } = req.params;

        if (!toolSlug) {
            return errorResponse(res, "Tool slug is required", 400);
        }

        const checkToolExist = await Tool.findOne({ slug: toolSlug });
        if (!checkToolExist) {
            return errorResponse(res, "Tool not found", 404);
        }

        const page = Math.max(parseInt(req.query.page) || 1, 1);
        const limit = Math.min(parseInt(req.query.limit) || 10, 50);
        const skip = (page - 1) * limit;

        //run parallel db operation to fetch reviews and stats
        const [toolReviews, reviewStats, totalCount] = await Promise.all([
            ToolReview.find({ toolId: checkToolExist._id })
                .populate("userId", "displayName avatarUrl")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),

            ToolReview.aggregate([
                {
                    $match: {
                        toolId: checkToolExist._id,
                    },
                },
                {
                    $group: {
                        _id: null,
                        averageRating: { $avg: "$rating" },
                    },
                },
            ]),

            ToolReview.countDocuments({
                toolId: checkToolExist._id,
            }),
        ]);

        const transformedReviews = toolReviews.map(review => ({
            id: review._id,
            rating: review.rating,
            comment: review.comment,
            createdAt: review.createdAt,
            user: {
                id: review.userId._id ?? "",
                name: review.userId.displayName ?? "",
                profilePicture: review.userId.avatarUrl ?? "",
            },
        }));

        const response = {
            averageRating: reviewStats[0]?.averageRating ?? 0,
            totalReviews: totalCount,

            pagination: {
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
                hasNextPage: page * limit < totalCount,
                hasPreviousPage: page > 1,
            },

            reviews: transformedReviews,
        };

        return successResponse(res, "Tool reviews fetched successfully", response, 200);
    } catch (error) {
        return errorResponse(res, error.message || "Failed to fetch tool reviews", 500);
    }
};
