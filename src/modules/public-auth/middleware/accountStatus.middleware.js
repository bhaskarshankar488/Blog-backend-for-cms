import { errorResponse } from "../../../utils/responseHandler.js";

/**
 * Public Account Status Middleware
 *
 * This middleware assumes that publicAuthMiddleware
 * has already authenticated the request and populated:
 *
 * req.publicAuth
 *
 * Responsibilities:
 * - Ensure account is active
 * - Reject suspended/inactive/deleted/banned users
 *
 * No JWT verification.
 * No database queries.
 * No Google logic.
 */
export const accountStatusMiddleware = (
  req,
  res,
  next
) => {
  const auth = req.publicAuth;

  if (!auth || !auth.user) {
    return errorResponse(
      res,
      "Authentication required",
      401
    );
  }

  const { user } = auth;

  // Soft deleted account
  if (user.deletedAt) {
    return errorResponse(
      res,
      "Account has been deleted",
      403
    );
  }

  switch (user.status) {
    case "active":
      return next();

    case "inactive":
      return errorResponse(
        res,
        "Account is inactive",
        403
      );

    case "suspended":
      return errorResponse(
        res,
        "Account has been suspended",
        403
      );

    case "banned":
      return errorResponse(
        res,
        "Account has been banned",
        403
      );

    case "deleted":
      return errorResponse(
        res,
        "Account has been deleted",
        403
      );

    default:
      return errorResponse(
        res,
        "Invalid account status",
        403
      );
  }
};

export default accountStatusMiddleware;