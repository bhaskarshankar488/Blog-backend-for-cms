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

const router = express.Router();

router.post(
  "/google",
  validate(googleLoginSchema),
  authenticateWithGoogle
);

router.post(
  "/refresh",
  validate(refreshSessionSchema),
  refreshSession
);

router.post(
  "/logout",
  validate(emptyBodySchema),
  logoutCurrentDevice
);

router.post(
  "/logout-all",
  validate(emptyBodySchema),
  logoutAllDevices
);

router.get(
  "/profile",
  validate(emptyBodySchema),
  getProfile
);

export default router;
