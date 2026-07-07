import mongoose from "mongoose";

export const PUBLIC_USER_STATUSES = [
  "active",
  "inactive",
  "suspended",
  "deleted",
];

const publicUserSchema = new mongoose.Schema(
  {
    primaryEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    emailVerified: {
      type: Boolean,
      default: false,
    },

    displayName: {
      type: String,
      trim: true,
      default: "",
    },

    firstName: {
      type: String,
      trim: true,
      default: "",
    },

    lastName: {
      type: String,
      trim: true,
      default: "",
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: PUBLIC_USER_STATUSES,
      default: "active",
      index: true,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "public_users",
  }
);

publicUserSchema.index(
  { primaryEmail: 1 },
  {
    unique: true,
    partialFilterExpression: {
      primaryEmail: { $type: "string" },
      deletedAt: null,
    },
  }
);

publicUserSchema.index({ status: 1, createdAt: -1 });
publicUserSchema.index({ lastLoginAt: -1 });
publicUserSchema.index({ deletedAt: 1 });

export const PublicUser = mongoose.model(
  "PublicUser",
  publicUserSchema
);
