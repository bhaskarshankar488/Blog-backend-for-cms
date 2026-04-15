import express from "express";
import { revalidatePage } from "../controllers/revalidate.controller.js";

const router = express.Router();

router.post("/", revalidatePage);

export default router;