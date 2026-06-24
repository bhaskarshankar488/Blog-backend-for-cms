import * as alternativeService from "./alternative.service.js";
import {successResponse,errorResponse,} from "../../utils/responseHandler.js";
import {uploadImage,} from "../../utils/uploadImage.js";
import Alternative from "./alternative.model.js";
import { deleteFromCloudinary} from "../../utils/cloudinary.js"

export const createAlternative = async (
  req,
  res
) => {
  try {
    const files = req.files;

    const images = {
      hero: await uploadImage(
        files?.hero_image?.[0]
      ),

      faq: await uploadImage(
        files?.faq_image?.[0]
      ),
    };

    req.body.images = images;

    const result =
      await alternativeService.createAlternative(
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

export const updateAlternative = async (
  req,
  res
) => {
  try {
    const alternative =
      await Alternative.findById(
        req.params.id
      );

    if (!alternative) {
      return errorResponse(
        res,
        "Alternative not found",
        404
      );
    }

    let images =
      alternative.images || {};

    const imageFields = [
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

    const result =
      await alternativeService.updateAlternative(
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

export const getAlternativeById =
  async (req, res) => {
    try {
      const result =
        await alternativeService.getAlternativeById(
          req.params.id
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

export const getAlternatives =
  async (req, res) => {
    try {
      const { search } = req.query;

      const result =
        await alternativeService.getAlternatives(
          search
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

export const deleteAlternative =
  async (req, res) => {
    try {
      const alternative =
        await Alternative.findById(
          req.params.id
        );

      if (!alternative) {
        return errorResponse(
          res,
          "Alternative not found",
          404
        );
      }

      const images =
        alternative.images || {};

      const imageKeys = [
        "hero",
        "faq",
      ];

      for (const key of imageKeys) {
        if (
          images[key]?.public_id
        ) {
          await deleteFromCloudinary(
            images[key].public_id
          );
        }
      }

      const result =
        await alternativeService.deleteAlternative(
          req.params.id
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