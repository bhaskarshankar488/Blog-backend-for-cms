import * as pageService from "../services/page/page.service.js";
import { Page } from "../models/page.model.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";
import { uploadToCloudinary, 
  deleteFromCloudinary,
 } from "../utils/cloudinary.js";

export const createPage = async (req, res) => {
  try {
    let catImageData = {
      url: "",
      public_id: "",
    };

    if (req.file) {
      const uploadResult = await uploadToCloudinary(
        req.file.buffer
      );

      catImageData = {
        url: uploadResult.secure_url,
        public_id: uploadResult.public_id,
      };
    }

    req.body.catImage = catImageData;

    const result = await pageService.createPage(
      req.body,
      req.user.id
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

// UPDATE
export const updatePage = async (req, res) => {
  try {
    const page = await Page.findById(req.params.id);

    if (!page) {
      return errorResponse(
        res,
        "Page not found",
        404
      );
    }

    let catImageData = page.catImage;

    // new image uploaded
    if (req.file) {

      // delete old image
      if (page.catImage?.public_id) {
        await deleteFromCloudinary(
          page.catImage.public_id
        );
      }

      // upload new image
      const uploaded =
        await uploadToCloudinary(
          req.file.buffer
        );

      catImageData = {
        url: uploaded.secure_url,
        public_id: uploaded.public_id,
      };
    }

    req.body.catImage = catImageData;

    const result =
      await pageService.updatePage(
        req.params.id,
        req.body,
        req.user.id
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

// DELETE
export const deletePage = async (req, res) => {
  try {
    const result = await pageService.deletePage(req.params.id, req.user.id);
    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const updatePageStatus = async (req, res) => {
  try {
    const result = await pageService.updatePageStatus(
      req.params.id,
      req.body.status,
      req.user.id
    );

    return successResponse(res, result.message, result.data);
  } catch (error) {
    return errorResponse(res, error.message, error.status || 500);
  }
};

export const getPageBySlug = async (req, res) => {
  try {
    const result = await pageService.getPageBySlug(req.params.slug,req.user.id);

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

    // GET SEARCH QUERY
    const { search } = req.query;

    // PASS SEARCH TO SERVICE
    const result = await pageService.getPages(search);

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

export const getPageById = async (req, res) => {
  try {
    const result = await pageService.getPageById(req.params.id, req.user.id);

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