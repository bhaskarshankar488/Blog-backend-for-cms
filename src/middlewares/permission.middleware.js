import { PERMISSIONS } from "../config/permissions.js";
import { errorResponse } from "../utils/responseHandler.js";

export const checkPermission = (module, action, options = {}) => {
  return async (req, res, next) => {
    try {
      const user = req.session?.user;

      // 🔒 Auth Check
      if (!user) {
        return errorResponse(res, "User not authenticated", 401);
      }

      const role = user.role?.toLowerCase();
      const modulePermissions = PERMISSIONS[role]?.[module] || [];

      // 🔒 Role Permission Check
      if (!modulePermissions.includes(action)) {
        return errorResponse(
          res,
          `Forbidden: ${role} cannot ${action} ${module}`,
          403
        );
      }

      req.user = user;

      next();
    } catch (err) {
      console.error("Permission Middleware Error:", err);
      return errorResponse(res, "Permission error", 500);
    }
  };
};