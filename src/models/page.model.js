import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: String,

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    pageDescription: String,

    // New Fields
    categoryDescription: {
      type: String,
      default: "",
    },

    catImage: {
      url: {
        type: String,
        default: "",
      },
      public_id: {
        type: String,
        default: "",
      },
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // Audit Fields
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

    meta: {
      title: String,
      description: String,
      keywords: [String],
    },

    tools: [
      {
        toolId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tool",
        },
        customDescription: String,
        rating: Number,
        reviews: {
          type: Number,
          default: 0,
        },
        position: Number,
      },
    ],

    faq: [
      {
        question: String,
        answer: String,
      },
    ],

    content: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["draft", "published", "unpublished"],
      default: "draft",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Page = mongoose.model("Page", pageSchema);