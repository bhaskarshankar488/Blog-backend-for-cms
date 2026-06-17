import * as toolContentService
from "../services/toolContent/toolContent.service.js";

import {
  successResponse,
  errorResponse,
} from "../utils/responseHandler.js";

export const createToolContent =
async (req, res) => {
  try {

    const result =
      await toolContentService
        .createToolContent(
          req.body
        );

    return successResponse(
      res,
      result.message,
      result.data,
      201
    );

  } catch (error) {

    return errorResponse(
      res,
      error.message,
      error.status || 500
    );

  }
};

export const updateToolContent =
  async (req, res) => {
    try {

      const result =
        await toolContentService
          .updateToolContent(
            req.params.toolId,
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

export const getToolContent =
async (req, res) => {

  try {

    const result =
      await toolContentService
        .getToolContent(
          req.params.toolId
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


export const getToolWithContent =
  async (req, res) => {
    try {

      const result =
        await toolContentService
          .getToolWithContent(
            req.params.toolId
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