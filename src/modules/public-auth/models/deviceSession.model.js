import mongoose from "mongoose";

export const DEVICE_SESSION_STATUSES = [
  "active",
  "revoked",
  "expired",
];

const deviceSessionSchema = new mongoose.Schema(
  {
    publicUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PublicUser",
      required: true,
      index: true,
    },

    authProviderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AuthProvider",
      default: null,
      index: true,
    },

    refreshTokenHash: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    tokenFamilyId: {
      type: String,
      required: true,
      index: true,
    },

    deviceId: {
      type: String,
      trim: true,
      default: "",
    },

    deviceName: {
      type: String,
      trim: true,
      default: "",
    },

    userAgent: {
      type: String,
      trim: true,
      default: "",
    },

    ipAddress: {
      type: String,
      trim: true,
      default: "",
    },

    status: {
      type: String,
      enum: DEVICE_SESSION_STATUSES,
      default: "active",
      index: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    lastUsedAt: {
      type: Date,
      default: null,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    revokedAt: {
      type: Date,
      default: null,
    },

    revokedReason: {
      type: String,
      trim: true,
      default: "",
    },

    replacedBySessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeviceSession",
      default: null,
    },
  },
  {
    timestamps: true,
    versionKey: false,
    collection: "device_sessions",
  }
);

deviceSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
deviceSessionSchema.index({ publicUserId: 1, status: 1, lastUsedAt: -1 });
deviceSessionSchema.index({ publicUserId: 1, tokenFamilyId: 1 });
deviceSessionSchema.index({ authProviderId: 1, status: 1 });
deviceSessionSchema.index({ status: 1, expiresAt: 1 });

export const DeviceSession = mongoose.model(
  "DeviceSession",
  deviceSessionSchema
);
