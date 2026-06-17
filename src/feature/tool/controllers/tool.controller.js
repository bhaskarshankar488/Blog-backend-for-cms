import { createTool } from "../services/tool.service.js";

export const createToolController = async (
  req,
  res,
  next
) => {
  try {
    const tool = await createTool(req.body);

    res.status(201).json({
      success: true,
      message: "Tool created successfully",
      data: tool,
    });
  } catch (error) {
    next(error);
  }
};