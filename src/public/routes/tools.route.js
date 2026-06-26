import express from "express";

import { validate } from "../../middlewares/validate.middleware.js";
import { getToolsPublicSchema, } from "../validators/tools.public.validator.js"

import {
    getTools,
    getToolBySlug,
} from "../controllers/tools.controller.js";

const router = express.Router();

router.get("/tools",
    validate(getToolsPublicSchema, "query"),
    getTools);

router.get("/tools/:toolSlug", getToolBySlug);

export default router;