import express from "express";
import { createToolReview, updateToolReview, getToolReviews } from "../controllers/toolReview.controller.js";
import { validate } from "../../../middlewares/validate.middleware.js";
import { createReviewSchema, updateReviewSchema } from "../validators/toolReview.validator.js";
import publicAuthMiddleware from "../../public-auth/middleware/publicAuth.middleware.js";
import accountStatusMiddleware from "../../public-auth/middleware/accountStatus.middleware.js";

const router = express.Router();

router.post(
    "/:toolSlug/reviews",
    publicAuthMiddleware,
    accountStatusMiddleware,
    validate(createReviewSchema),
    createToolReview
);

router.put(
    "/:toolSlug/reviews",
    publicAuthMiddleware,
    accountStatusMiddleware,
    validate(updateReviewSchema),
    updateToolReview
);

router.get("/:toolSlug/reviews", getToolReviews);

export default router;

