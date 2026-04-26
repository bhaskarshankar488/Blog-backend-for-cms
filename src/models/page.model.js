import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: String,

    slug: {
      type: String,
      unique: true,
      index: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
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
            default: 0
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

    // 🔥 NEW CONTENT FIELD
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