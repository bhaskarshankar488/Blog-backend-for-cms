import express from "express";

import {
  getCategories,
  //getCategoryBySlug,
  // getPageByCategoryAndSlug,

  //TOOL

  getToolsByCategorySlug,
  getToolByCategoryAndSlug,

  //PAGE
  getPagesByCategorySlug,
  getPageByCategoryAndSlug,

} from "../controllers/Categories.controller.js";

const router = express.Router();

router.get(
  "/categories",
  getCategories
);

// router.get(
//   "/categories/:slug",
//   getCategoryBySlug
// );
// router.get(
//   "/:categorySlug/:pageSlug",
//   getPageByCategoryAndSlug
// );

// get tool for list page 

router.get(
  "/categories/:categorySlug/tools",
  getToolsByCategorySlug
);

router.get(
  "/categories/:categorySlug/tools/:toolSlug",
  getToolByCategoryAndSlug
);

//page

router.get(
  "/categories/:categorySlug/pages",
  getPagesByCategorySlug
);
router.get(
  "/categories/:categorySlug/pages/:pageSlug",
  getPageByCategoryAndSlug
);


export default router;