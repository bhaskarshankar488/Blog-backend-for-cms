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

    image: {
      url: {
        type: String,
        default: "",
      },

      public_id: {
        type: String,
        default: "",
      },
    },

    brand: {
      type: String,
      required: true,
      trim: true,
    },

    link: {
      type: String,
      required: true,
      trim: true,
    },

    globalDescription: {
      type: String,
      default: "",
    },

    // ✅ Max 3 tags only
    tags: {
      type: [String],
      validate: {
        validator: function (val) {
          return val.length <= 3;
        },
        message: "Maximum 3 keywords allowed",
      },
      default: [],
    },

    // ✅ Rating Value (Max 5)
    ratingValue: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    // ✅ Total Rating Count
    ratingCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    // ✅ Total Review Count
    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tool = mongoose.model("Tool", toolSchema);