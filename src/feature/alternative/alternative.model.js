import mongoose from "mongoose";

const alternativeToolSchema =
    new mongoose.Schema(
        {
            toolId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tool",
                required: true,
            },

            customDescription: {
                type: String,
                default: "",
                trim: true,
            },

            position: {
                type: Number,
                default: 0,
            },
        },
        {
            _id: false,
        }
    );

const alternativeSchema =
    new mongoose.Schema(
        {
            title: {
                type: String,
                required: true,
                trim: true,
            },
            toolId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Tool",
                required: true,
            },
            slug: {
                type: String,
                required: true,
                unique: true,
                index: true,
                trim: true,
            },

            pageDescription: {
                type: String,
                default: "",
                trim: true,
            },

            seo: {
                metaTitle: {
                    type: String,
                    default: "",
                    trim: true,
                },

                metaDescription: {
                    type: String,
                    default: "",
                    trim: true,
                },

                metaKeywords: {
                    type: [String],
                    default: [],
                },
            },

            tools: [alternativeToolSchema],

            faq: [
                {
                    question: {
                        type: String,
                        required: true,
                        trim: true,
                    },

                    answer: {
                        type: String,
                        required: true,
                        trim: true,
                    },
                },
            ],

            content: {
                type: String,
                default: "",
                trim: true,
            },

            status: {
                type: String,
                enum: ["active", "inactive"],
                default: "active",
            },

            createdBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },

            updatedBy: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
        {
            timestamps: true,
            versionKey: false,
        }
    );

const Alternative = mongoose.model(
    "Alternative",
    alternativeSchema
);

export default Alternative;