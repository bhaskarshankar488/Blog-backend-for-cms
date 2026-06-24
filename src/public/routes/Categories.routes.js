import express from "express";

import {
  getCategories,
  getCategoryBySlug,
  getPageByCategoryAndSlug
} from "../controllers/Categories.controller.js";

const router = express.Router();

router.get(
  "/categories",
  getCategories
);

router.get(
  "/categories/:slug",
  getCategoryBySlug
);
router.get(
  "/:categorySlug/:pageSlug",
  getPageByCategoryAndSlug
);

export default router;