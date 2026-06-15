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

    images: {
      tool: {
        url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },

      hero: {
        url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
      },

      faq: {
        url: {
          type: String,
          default: "",
        },
        public_id: {
          type: String,
          default: "",
        },
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

    pricingLabel: {
      type: String,
      default: "",
      trim: true,
    },

    // NEW
    whatIsIt: {
      type: String,
      default: "",
      trim: true,
    },

    // ✅ NEW FIELDS
    ratingValue: {
      type: Number,
      min: 0,
      max: 5,
      default: 0,
    },

    ratingCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    reviewCount: {
      type: Number,
      min: 0,
      default: 0,
    },

    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
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

export const Tool = mongoose.model(
  "Tool",
  toolSchema
);