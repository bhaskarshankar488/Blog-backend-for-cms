import * as subscriberService from "../services/subscriber.service.js";
import {
  successResponse,
  errorResponse,
} from "../../../../utils/responseHandler.js";

export const getSubscribers = async (req, res) => {
  try {
    const result = await subscriberService.getSubscribers(req.query);

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

export const deleteSubscriber = async (req, res) => {
  try {
    const result = await subscriberService.deleteSubscriber(
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