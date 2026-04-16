import express from "express";

import {
  createPage,
  updatePage,
  deletePage,
  updatePageStatus,
  getPageBySlug,
  previewPage,
  getPages
} from "../controllers/page.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

import {
  createPageSchema,
  updatePageSchema,
  updateStatusSchema
} from "../validators/page.validator.js";

const router = express.Router();

// CREATE PAGE
router.post(
  "/",
  isAuthenticated,
  checkPermission("pages", "create"),
  validate(createPageSchema),
  createPage
);

// UPDATE PAGE
router.put(
  "/:id",
  isAuthenticated,
  checkPermission("pages", "update"),
  validate(updatePageSchema),
  updatePage
);

// DELETE PAGE
router.delete(
  "/:id",
  isAuthenticated,
  checkPermission("pages", "delete"),
  deletePage
);

// UPDATE STATUS (DRAFT / PUBLISH)
router.patch(
  "/:id/status",
  isAuthenticated,
  checkPermission("pages", "update"),
  validate(updateStatusSchema),
  updatePageStatus
);

router.get(
  "/",
  isAuthenticated,
  checkPermission("pages", "read"),
  getPages
);

router.get("/preview/:slug", previewPage);

router.get("/:slug", getPageBySlug);


export default router;