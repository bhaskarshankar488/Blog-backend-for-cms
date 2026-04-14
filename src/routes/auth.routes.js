import express from "express";
import { loginUser, logoutUser } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/user.validator.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/login", validate(loginSchema), loginUser);
router.post("/logout", isAuthenticated, logoutUser);

export default router;