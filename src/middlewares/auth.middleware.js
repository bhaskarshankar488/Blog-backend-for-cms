import { errorResponse } from "../utils/responseHandler.js";

export const isAuthenticated = (req, res, next) => {
  try {
    // 1. Check session
    if (!req.session || !req.session.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    // 2. Attach user to request (best practice)
    req.user = req.session.user;

    // 3. Continue
    next();

  } catch (error) {
    return errorResponse(res, "Authentication failed", 500);
  }
};