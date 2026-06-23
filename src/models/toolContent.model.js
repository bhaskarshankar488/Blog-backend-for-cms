import mongoose from "mongoose";

const alternativeToolSchema =
  new mongoose.Schema(
    {
      alternativeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Alternative",
        required: true,
      },

      isSponsored: {
        type: Boolean,
        default: false,
      },

      position: {
        type: Number,
        required: true,
        min: 1,
      },
    },
    {
      _id: false,
    }
  );

const toolContentSchema =
  new mongoose.Schema(
    {
      toolId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tool",
        required: true,
        unique: true,
      },
      alternativeTools: {
        type: [alternativeToolSchema],
        default: [],
      },

      hero: {
        type: Object,
        default: {},
      },

      coreCapabilities: {
        type: Array,
        default: [],
      },

      prosCons: {
        type: Object,
        default: {},
      },

      latestBlogs: {
        type: Array,
        default: [],
      },

      engineAndValue: {
        type: Array,
        default: [],
      },

      underTheHood: {
        type: Array,
        default: [],
      },

      features: {
        type: Array,
        default: [],
      },

      bestFor: {
        type: Array,
        default: [],
      },

      performanceSection: {
        type: Object,
        default: {},
      },

      pricing: {
        type: Object,
        default: {},
      },

      faqs: {
        type: Array,
        default: [],
      },

      ctaBanner: {
        type: Object,
        default: {},
      },
    },
    {
      timestamps: true,
      versionKey: false,
    }
  );

export const ToolContent =
  mongoose.model(
    "ToolContent",
    toolContentSchema
  );