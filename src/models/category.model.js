import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: String,

  slug: {
    type: String,
    unique: true,
    index: true
  }
});

export const Category = mongoose.model("Category", categorySchema);