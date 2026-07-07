import express from "express";

import { validate } from "../../../middlewares/validate.middleware.js";

import {
  authenticateWithGoogle,
  refreshSession,
  logoutCurrentDevice,
  logoutAllDevices,
  getProfile,
} from "../controllers/publicAuth.controller.js";

import {
  googleLoginSchema,
  refreshSessionSchema,
  emptyBodySchema,
} from "../validators/publicAuth.validator.js";

import publicAuthMiddleware from "../middleware/publicAuth.middleware.js";
import accountStatusMiddleware from "../middleware/accountStatus.middleware.js";

const router = express.Router();

/**
 * Google Authentication
 */
router.post(
  "/google",
  validate(googleLoginSchema),
  authenticateWithGoogle
);

/**
 * Refresh Access Token
 */
router.post(
  "/refresh",
  validate(refreshSessionSchema),
  refreshSession
);

/**
 * Logout Current Device
 */
router.post(
  "/logout",
  publicAuthMiddleware,
  accountStatusMiddleware,
  validate(emptyBodySchema),
  logoutCurrentDevice
);

/**
 * Logout All Devices
 */
router.post(
  "/logout-all",
  publicAuthMiddleware,
  accountStatusMiddleware,
  validate(emptyBodySchema),
  logoutAllDevices
);

/**
 * Current User Profile
 */
router.get(
  "/profile",
  publicAuthMiddleware,
  accountStatusMiddleware,
  getProfile
);

export default router;