import express from "express";
import {createToolController} from "../controllers/tool.controller.js";


const router = express.Router();

router.post("/", createToolController);

export default router;