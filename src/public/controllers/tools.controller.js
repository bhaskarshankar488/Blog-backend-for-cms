import * as toolService from "../services/tools.service.js";

import {
  successResponse,
  errorResponse,
} from "../../utils/responseHandler.js";

// Get all tools (minimal information)

export const getTools = async (req, res) => {
  try {
    const page = Number(req.query.page);
    const limit = Number(req.query.limit);

    const result = await toolService.getTools(
      page,
      limit
    );
    return res.status(200).json({
      success: true,
      message: result.message,
      totalTools: result.totalTools,
      pagination: result.pagination,
      data: result.data,
    });
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};

export const getToolBySlug = async (req, res) => {
  try {
    const { toolSlug } = req.params;

    const result = await toolService.getToolBySlug(toolSlug);

    return successResponse(
      res,
      result.data,
      result.message
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};