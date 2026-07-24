import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format'],
    },
    ipAddress: {
      type: String,
      required: true,
      maxlength: 45, // supports IPv6
    },
    userAgent: {
      type: String,
      default: '',
      maxlength: 512,
    },
  },
  {
    timestamps: true, // createdAt / updatedAt
    versionKey: false,
  }
);

// Avoid OverwriteModelError if this file is ever imported twice (e.g. hot reload)
const Subscriber =
  mongoose.models.Subscriber || mongoose.model('Subscriber', subscriberSchema);

export default Subscriber;
