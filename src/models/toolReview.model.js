import mongoose from "mongoose";

const toolReviewSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PublicUser",
            required: true,
        },

        toolId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tool",
            required: true,
        },

        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },

        comment: {
            type: String,
            required: true,
            minLength: 1,
            maxLength: 1000,
            trim: true,
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

toolReviewSchema.index({ toolId: 1, userId: 1 }, { unique: true });
toolReviewSchema.index({ toolId: 1, createdAt: -1 });

export const ToolReview = mongoose.model("ToolReview", toolReviewSchema);
