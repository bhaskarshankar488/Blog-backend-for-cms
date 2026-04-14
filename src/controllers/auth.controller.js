import * as authService from "../services/user/user.service.js";
import { successResponse, errorResponse } from "../utils/responseHandler.js";

// LOGIN USER
export const loginUser = async (req, res) => {
  try {
    const loginData = req.body;

    const user = await authService.loginUser(loginData);

    // Store session
    req.session.user = user;

    return successResponse(res, "Login successful", user, 200);

  } catch (error) {
    return errorResponse(res, error.message, 401);
  }
};

// LOGOUT USER
export const logoutUser = async (req, res) => {
  try {
    // 1. Call service
    await authService.logoutUser(req);

    // 2. Send response
    return successResponse(res, "Logout successful", null, 200);

  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};