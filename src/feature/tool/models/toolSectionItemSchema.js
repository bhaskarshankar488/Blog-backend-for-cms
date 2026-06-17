import mongoose from "mongoose";

const toolSectionItemSchema = new mongoose.Schema(
  {
    sectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ToolSection",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "",
    },

    description: {
      type: String,
      default: "",
    },

    image: {
      url: String,
      public_id: String,
    },

    metadata: {
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

export const ToolSectionItem = mongoose.model(
  "ToolSectionItem",
  toolSectionItemSchema
);