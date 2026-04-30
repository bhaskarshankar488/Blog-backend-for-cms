import express from "express";
import { createTool, getTools, updateTool, deleteTool,
  getToolById
} from "../controllers/tool.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

import {
  createToolSchema,
  getToolsSchema,
  updateToolSchema,
  toolIdSchema
} from "../validators/tool.validator.js";

import { upload } from "../middlewares/upload.middleware.js";

const router = express.Router();

// CREATE TOOL
router.post(
  "/",
  isAuthenticated,
  checkPermission("tools", "create"),
  upload.single("image"),
  validate(createToolSchema),
  createTool
);

// GET TOOLS (SEARCH)
router.get(
  "/",
  isAuthenticated,
  checkPermission("tools", "read"),
  validate(getToolsSchema, "query"),
  getTools
);

router.put(
  "/:id",
  isAuthenticated,
  checkPermission("tools", "update"),
  validate(toolIdSchema, "params"),   
  validate(updateToolSchema),
  upload.single("image"),   
  updateTool
);


router.delete(
  "/:id",
  isAuthenticated,
  checkPermission("tools", "delete"),
  validate(toolIdSchema, "params"),
  deleteTool
);

router.get(
  "/:id",
  isAuthenticated,
  checkPermission("tools", "read"),
  validate(toolIdSchema, "params"),
  getToolById
);

export default router;