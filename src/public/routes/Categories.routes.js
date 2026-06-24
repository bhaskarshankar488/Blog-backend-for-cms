import express from "express";

import {
  getCategories,
  getCategoryBySlug,
  getPageByCategoryAndSlug,

  getToolsByCategorySlug,
  getToolByCategoryAndSlug

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

// get tool for list page 

router.get(
  "/categories/:categorySlug/tools",
  getToolsByCategorySlug
);

router.get(
  "/categories/:categorySlug/tools/:toolSlug",
  getToolByCategoryAndSlug
);

export default router;