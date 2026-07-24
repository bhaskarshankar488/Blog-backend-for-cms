import express from "express";

import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

import {createToolContent,updateToolContent, getToolContent, getToolWithContent} from "../controllers/toolContent.controller.js"
import { createToolContentSchema,
    updateToolContentSchema, toolContentIdSchema, toolFullSchema
} from "../validators/toolContent.validator.js";



const router = express.Router();

router.post("/",
  isAuthenticated,
  validate(createToolContentSchema),
  createToolContent
);

router.put(
  "/:toolId",
  isAuthenticated,
  validate(toolContentIdSchema,"params"),
  validate(updateToolContentSchema),
  updateToolContent
);

router.get(
  "/:toolId",
  isAuthenticated,
   validate(toolContentIdSchema,"params"),
  getToolContent
);

router.get(
  "/:toolId/full",
  isAuthenticated,
  validate(toolFullSchema, "params"),
  getToolWithContent
);
export default router;