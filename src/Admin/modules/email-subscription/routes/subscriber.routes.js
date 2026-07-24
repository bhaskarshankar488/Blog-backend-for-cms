import express from "express";

import {
  getSubscribers,
  deleteSubscriber,
} from "../controllers/subscriber.controller.js";

import { validate } from "../../../../middlewares/validate.middleware.js";
import { isAuthenticated } from "./../../../../middlewares/auth.middleware.js";
import { checkPermission } from "./../../../../middlewares/permission.middleware.js";

import {
  getSubscribersSchema,
  subscriberIdSchema,
} from "../validators/subscriber.validator.js";

const router = express.Router();

/**
 * GET ALL SUBSCRIBERS
 */
router.get(
  "/",
  isAuthenticated,
  checkPermission("subscribers", "read"),
  validate(getSubscribersSchema, "query"),
  getSubscribers,
);

/**
 * DELETE SUBSCRIBER
 */
router.delete(
  "/:id",
  isAuthenticated,
  checkPermission("subscribers", "delete"),
  validate(subscriberIdSchema, "params"),
  deleteSubscriber
);

export default router;