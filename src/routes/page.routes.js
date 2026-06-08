import express from "express";
import { upload } from "../middlewares/upload.middleware.js";

import {
  createPage,
  updatePage,
  deletePage,
  updatePageStatus,
  getPageBySlug,
  previewPage,
  getPages,
  getPageById,
  getPageByCategoryAndSlug
} from "../controllers/page.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";
import { parseMultipartJson } from "../middlewares/parseMultipartJson.js";

import {
  createPageSchema,
  updatePageSchema,
  updateStatusSchema,
  pageIdSchema
} from "../validators/page.validator.js";

const router = express.Router();

// CREATE PAGE
router.post(
  "/",
  isAuthenticated,
  checkPermission("pages", "create"),
  upload.single("catImage"),
  parseMultipartJson,
  validate(createPageSchema),
  createPage
);

// UPDATE PAGE
router.put(
  "/:id",
  isAuthenticated,
  checkPermission("pages", "update"),
  upload.single("catImage"),
  parseMultipartJson,
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

// GET PAGE BY ID (ADMIN)
router.get(
  "/id/:id",
  isAuthenticated,
  checkPermission("pages", "read"),
  validate(pageIdSchema, "params"),
  getPageById
);

router.get("/preview/:slug", previewPage);

router.get(
  "/:categorySlug/:pageSlug",
  getPageByCategoryAndSlug
);


export default router;