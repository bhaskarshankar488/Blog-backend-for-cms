import mongoose from "mongoose";

export const AUTH_PROVIDER_TYPES = [
  "google",
  "github",
  "apple",
  "linkedin",
  "microsoft",
];

const authProviderSchema = new mongoose.Schema(
  {
    publicUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicUser",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      enum: AUTH_PROVIDER_TYPES,
      required: true,
      lowercase: true,
      trim: true,
    },

    providerAccountId: {
      type: String,
      required: true,
      trim: true,
    },

    providerEmail: {
      type: String,
      lowercase: true,
      trim: true,
      default: null,
    },

    providerEmailVerified: {
      type: Boolean,
      default: false,
    },

    displayName: {
      type: String,
      trim: true,
      default: "",
    },

    avatarUrl: {
      type: String,
      trim: true,
      default: "",
    },

    profileUrl: {
      type: String,
      trim: true,
      default: "",
    },

    scopes: {
      type: [String],
      default: [],
    },

    connectedAt: {
      type: Date,
      default: Date.now,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    disconnectedAt: {
      type: Date,
      default: null,
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "auth_providers",
  }
);

authProviderSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true }
);

authProviderSchema.index(
  { publicUserId: 1, provider: 1 },
  {
    unique: true,
    partialFilterExpression: {
      disconnectedAt: null,
    },
  }
);

authProviderSchema.index({ publicUserId: 1, connectedAt: -1 });
authProviderSchema.index({ providerEmail: 1 });
authProviderSchema.index({ disconnectedAt: 1 });

export const AuthProvider = mongoose.model(
  "AuthProvider",
  authProviderSchema
);
