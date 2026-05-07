import { errorResponse } from "../utils/responseHandler.js";

export const isAuthenticated = (req, res, next) => {
  try {
    // 1. Check session
    if (!req.session || !req.session.user) {
      return errorResponse(res, "Unauthorized", 401);
    }

    // 2. Refresh session expiry
    req.session.touch();

    // 3. Attach user to request
    req.user = req.session.user;

    // 4. Continue
    next();

  } catch (error) {
    return errorResponse(res, "Authentication failed", 500);
  }
};