import * as toolService from "../services/tool/tool.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { uploadImage, replaceImage } from "../utils/uploadImage.js";
import { Tool } from "../models/tool.model.js";
import {deleteFromCloudinary,} from "../utils/cloudinary.js";

export const createTool = async (req, res) => {
  try {
    const files = req.files;

    const images = {
      tool: await uploadImage(
        files?.tool_image?.[0]
      ),

      hero: await uploadImage(
        files?.hero_image?.[0]
      ),

      faq: await uploadImage(
        files?.faq_image?.[0]
      ),
    };

    req.body.images = images;

    // call service
    const result = await toolService.createTool(req.body);

    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const updateTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return errorResponse(res, "Tool not found", 404);
    }

    let images = tool.images || {};

    const imageFields = [
      ["tool", "tool_image"],
      ["hero", "hero_image"],
      ["faq", "faq_image"],
    ];

    for (const [key, fieldName] of imageFields) {
      images[key] = await replaceImage(
        images[key],
        req.files?.[fieldName]?.[0]
      );
    }

    req.body.images = images;

    const result = await toolService.updateTool(
      req.params.id,
      req.body
    );

    return successResponse(
      res,
      result.message,
      result.data
    );
  } catch (error) {
    return errorResponse(
      res,
      error.message,
      error.status || 500
    );
  }
};

export const getToolssearch = async (req, res) => {
  try {
    const result = await toolService.getToolssearch(req.query.search);
    return successResponse(res, result.message, result.data);
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

export const deleteTool = async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return errorResponse(res, "Tool not found", 404);
    }

    const imageList = [
      tool.images?.tool,
      tool.images?.hero,
      tool.images?.faq,
    ];

    for (const image of imageList) {
      if (image?.public_id) {
        await deleteFromCloudinary(image.public_id);
      }
    }

    const result = await toolService.deleteTool(req.params.id);

    return successResponse(res, result.message, result.data);

  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getToolById = async (req, res) => {
  try {
    const result = await toolService.getToolById(req.params.id);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

