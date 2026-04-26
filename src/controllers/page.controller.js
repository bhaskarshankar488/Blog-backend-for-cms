import * as pageService from "../services/page/page.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// CREATE
export const createPage = async (req, res) => {
  try {
    const result = await pageService.createPage(req.body);
    return successResponse(res, result.message, result.data, 201);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// UPDATE
export const updatePage = async (req, res) => {
  try {
    const result = await pageService.updatePage(req.params.id, req.body);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

// DELETE
export const deletePage = async (req, res) => {
  try {
    const result = await pageService.deletePage(req.params.id);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const updatePageStatus = async (req, res) => {
  try {
    const result = await pageService.updatePageStatus(
      req.params.id,
      req.body.status
    );

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getPageBySlug = async (req, res) => {
  try {
    const result = await pageService.getPageBySlug(req.params.slug);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const previewPage = async (req, res) => {
  try {
    const result = await pageService.previewPageBySlug(req.params.slug);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getPages = async (req, res) => {
  try {
    const result = await pageService.getPages();

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getPageById = async (req, res) => {
  try {
    const result = await pageService.getPageById(req.params.id);

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getPageByCategoryAndSlug = async (req, res) => {
  try {
    const { categorySlug, pageSlug } = req.params;

    const result = await pageService.getPageByCategoryAndSlug(
      categorySlug,
      pageSlug
    );

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};