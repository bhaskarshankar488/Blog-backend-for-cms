import mongoose from "mongoose";

const toolSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    image: String,

    brand: String,

    globalDescription: String,

    // ✅ FIXED POSITION
    tags: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 3;
        },
        message: "Maximum 3 keywords allowed",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tool = mongoose.model("Tool", toolSchema);