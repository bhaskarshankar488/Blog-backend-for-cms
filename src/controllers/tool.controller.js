import * as toolService from "../services/tool/tool.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { Tool } from "../models/tool.model.js";
import { uploadToCloudinary, 
  deleteFromCloudinary,
 } from "../utils/cloudinary.js";

export const createTool = async (req, res) => {
  try {
    let imageData = {
      url: "",
      public_id: "",
    };

    // image exists
    if (req.file) {
      const result = await uploadToCloudinary(req.file.buffer);

      imageData = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    // inject image into body
    req.body.image = imageData;

    // call service
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
    const tool = await Tool.findById(req.params.id);

    if (!tool) {
      return errorResponse(res, "Tool not found", 404);
    }

    let imageData = tool.image;

    // new image uploaded
    if (req.file) {

      // delete old image
      if (tool.image?.public_id) {
        await deleteFromCloudinary(tool.image.public_id);
      }

      // upload new image
      const uploaded = await uploadToCloudinary(req.file.buffer);

      imageData = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    req.body.image = imageData;

    const result = await toolService.updateTool(
      req.params.id,
      req.body
    );

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

    // delete image from cloudinary
    if (tool.image?.public_id) {
      await deleteFromCloudinary(tool.image.public_id);
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

