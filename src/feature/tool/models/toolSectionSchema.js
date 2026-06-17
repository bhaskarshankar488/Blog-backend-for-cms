import mongoose from "mongoose";

const toolSectionSchema = new mongoose.Schema(
  {
    toolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tool",
      required: true,
      index: true,
    },

    key: {
      type: String,
      required: true,
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "card_grid",
        "accordion",
        "metrics",
        "blog_list",
        "comparison",
        "logo_grid",
        "custom",
      ],
    },

    description: {
      type: String,
      default: "",
    },
    settings: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    order: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const ToolSection = mongoose.model(
  "ToolSection",
  toolSectionSchema
);