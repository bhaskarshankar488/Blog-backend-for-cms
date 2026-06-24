import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    title: {
      type: String,
      default: ""
    },

    description: {
      type: String,
      default: ""
    },

    seoTitle: {
      type: String,
      default: ""
    },

    seoDescription: {
      type: String,
      default: ""
    },

    seoKeywords: [
      {
        type: String
      }
    ]
  },
  {
    timestamps: true
  }
);

 export const Category = mongoose.model(
  "Category",
  categorySchema
);