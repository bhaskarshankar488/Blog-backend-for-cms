import * as publicService from "../services/Categories.service.js";
import {getPageBySlug} from "../../services/page/page.service.js"

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

    return res.status(200).json({
      success: true,
      message: result.message,
      summary: result.summary,
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

// get tool for toll page minimal imformation

export const getToolsByCategorySlug =
  async (req, res) => {
    try {
      const { categorySlug } = req.params;

      const page = Number(req.query.page);
      const limit = Number(req.query.limit);

      const result =
        await publicService.getToolsByCategorySlug(
          categorySlug,
          page,
          limit
        );

      return res.status(200).json({
        success: true,
        message: result.message,
        category: result.category,
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

  

 export const getToolByCategoryAndSlug =
  async (req, res) => {
    try {
      const {
        categorySlug,
        toolSlug,
      } = req.params;

      const result =
        await publicService.getToolByCategoryAndSlug(
          categorySlug,
          toolSlug
        );

      return res.status(200).json({
        success: true,
        message: result.message,
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

  // get page page list 

  export const getPagesByCategorySlug =
  async (req, res) => {
    try {
      const { categorySlug } =
        req.params;

      const page =
        req.query.page;

      const limit =
        req.query.limit;

      const result =
        await publicService.getPagesByCategorySlug(
          categorySlug,
          page,
          limit
        );

      return res.status(200).json({
        success: true,
        message: result.message,
        category:
          result.category,
        pagination:
          result.pagination,
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

  
  export const getPageByCategoryAndSlug =
  async (req, res) => {
    try {
      const {
        categorySlug,
        pageSlug,
      } = req.params;

      const result =
        await getPageBySlug(
          pageSlug
        );

      return res.status(200).json({
        success: true,
        message: result.message,
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

