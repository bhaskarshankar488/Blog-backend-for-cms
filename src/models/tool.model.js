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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export const Tool = mongoose.model("Tool", toolSchema);