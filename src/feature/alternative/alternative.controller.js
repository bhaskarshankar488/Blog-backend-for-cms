import * as alternativeService from "./alternative.service.js";

import { successResponse, errorResponse, } from "../../utils/responseHandler.js";

export const createAlternative =
  async (req, res) => {
    try {
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

export const updateAlternative =
  async (req, res) => {
    try {
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