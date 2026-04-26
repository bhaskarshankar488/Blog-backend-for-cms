import * as categoryService from "../services/category/category.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";


// CREATE
export const createCategory = async (req, res) => {
  try {
    const result = await categoryService.createCategory(req.body);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// GET ALL
export const getCategories = async (req, res) => {
  try {
    const result = await categoryService.getCategories();
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// UPDATE
export const updateCategory = async (req, res) => {
  try {
    const result = await categoryService.updateCategory(
      req.params.id,
      req.body
    );

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// DELETE
export const deleteCategory = async (req, res) => {
  try {
    const result = await categoryService.deleteCategory(req.params.id);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};
export const getCategoryById = async (req, res) => {
  try {
    const result = await categoryService.getCategoryById(req.params.id);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};