import express from "express";

import {
    createAlternative, updateAlternative,
    getAlternatives,
    getAlternativeById,
    deleteAlternative,
} from "./alternative.controller.js";

import { isAuthenticated } from "../../middlewares/auth.middleware.js";

import {
    createAlternativeSchema,
    updateAlternativeSchema,
    alternativeIdSchema,
} from "./alternative.validator.js";

import {validate,} from "../../middlewares/validate.middleware.js";
import { upload } from "../../middlewares/upload.middleware.js";
import{parseMultipartJson,} from "../../middlewares/parseMultipartJson.js"

const router = express.Router();

router.post("/",
    isAuthenticated,
    upload.fields([
        {
            name: "hero_image",
            maxCount: 1,
        },
        {
            name: "faq_image",
            maxCount: 1,
        },
    ]),
    parseMultipartJson,
    validate(createAlternativeSchema),
    createAlternative);

router.get("/",
    isAuthenticated,
    getAlternatives);

router.get("/:id",
    isAuthenticated,
    validate(alternativeIdSchema, "params"),
    getAlternativeById);

router.put("/:id",
    isAuthenticated,
    upload.fields([
        {
            name: "hero_image",
            maxCount: 1,
        },
        {
            name: "faq_image",
            maxCount: 1,
        },
    ]),
    parseMultipartJson,
    validate(alternativeIdSchema, "params"),
    validate(updateAlternativeSchema),
    updateAlternative);

router.delete("/:id",
    isAuthenticated,
    deleteAlternative);

export default router;