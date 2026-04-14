import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // MongoDB automatically creates _id
    // If you REALLY want UserID, we can simulate it (shown below)

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["viewer", "analyst", "admin"],
      default: "viewer",
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false, // removes __v
  }
);

export const User = mongoose.model("User", userSchema);