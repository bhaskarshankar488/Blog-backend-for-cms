import express from "express";
import {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
  getCategoryById,
} from "../controllers/category.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

import {
  createCategorySchema,
  updateCategorySchema,
  categoryIdSchema,
} from "../validators/category.validator.js";

const router = express.Router();

// CREATE
router.post(
  "/",
  isAuthenticated,
  checkPermission("categories", "create"),
  validate(createCategorySchema),
  createCategory
);

// GET ALL
router.get(
  "/",
  isAuthenticated,
  checkPermission("categories", "read"),
  getCategories
);

// UPDATE
router.put(
  "/:id",
  isAuthenticated,
  checkPermission("categories", "update"),
  validate(categoryIdSchema, "params"),
  validate(updateCategorySchema),
  updateCategory
);

// DELETE
router.delete(
  "/:id",
  isAuthenticated,
  checkPermission("categories", "delete"),
  validate(categoryIdSchema, "params"),
  deleteCategory
);

router.get("/:id", 
   isAuthenticated,
  checkPermission("categories", "read"),
  validate(categoryIdSchema, "params"),
  getCategoryById)

export default router;