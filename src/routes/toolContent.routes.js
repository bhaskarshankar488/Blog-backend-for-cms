import express from "express";

import { validate } from "../middlewares/validate.middleware.js";

import {createToolContent,updateToolContent, getToolContent, getToolWithContent} from "../controllers/toolContent.controller.js"
import { createToolContentSchema,
    updateToolContentSchema, toolContentIdSchema, toolFullSchema
} from "../validators/toolContent.validator.js";



const router = express.Router();

router.post("/",
  validate(createToolContentSchema),
  createToolContent
);

router.put(
  "/:toolId",
  validate(toolContentIdSchema,"params"),
  validate(updateToolContentSchema),
  updateToolContent
);

router.get(
  "/:toolId",
   validate(toolContentIdSchema,"params"),
  getToolContent
);

router.get(
  "/:toolId/full",
  validate(toolFullSchema, "params"),
  getToolWithContent
);
export default router;