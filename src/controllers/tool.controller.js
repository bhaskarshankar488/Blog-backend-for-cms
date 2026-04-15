import * as toolService from "../services/tool/tool.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

export const createTool = async (req, res) => {
  try {
    const result = await toolService.createTool(req.body);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getTools = async (req, res) => {
  try {
    const result = await toolService.getTools(req.query.search);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const updateTool = async (req, res) => {
  try {
    const result = await toolService.updateTool(req.params.id, req.body);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const deleteTool = async (req, res) => {
  try {
    const result = await toolService.deleteTool(req.params.id);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};