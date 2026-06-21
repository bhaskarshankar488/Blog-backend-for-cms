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

import {validate,
} from "../../middlewares/validate.middleware.js";

const router = express.Router();

router.post("/",
    isAuthenticated,
    validate(createAlternativeSchema),
    createAlternative);

router.get("/",
    isAuthenticated,
    getAlternatives);

router.get("/:id",
    validate(
        alternativeIdSchema, "params"),
    isAuthenticated,
    getAlternativeById);

router.put("/:id",
    validate(alternativeIdSchema, "params"),
    validate(updateAlternativeSchema),
    isAuthenticated,
    updateAlternative);

router.delete("/:id",
    isAuthenticated,
    deleteAlternative);

export default router;