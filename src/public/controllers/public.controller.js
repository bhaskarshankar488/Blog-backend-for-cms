import * as publicService from "../services/public.service.js";

import {
  successResponse,
  errorResponse,
} from "../../utils/responseHandler.js";

export const getCategories = async (
  req,
  res
) => {
  try {
    const result =
      await publicService.getCategories();

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

export const getCategoryBySlug =
  async (req, res) => {
    try {
      const result =
        await publicService.getCategoryBySlug(
          req.params.slug
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

export const getPageByCategoryAndSlug = async (req, res) => {
  try {
    const { categorySlug, pageSlug } = req.params;

    const result =
      await publicService.getPageByCategoryAndSlug(
        categorySlug,
        pageSlug
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