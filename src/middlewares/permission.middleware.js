// middlewares/permission.middleware.js

import { PERMISSIONS } from "../config/permissions.js";
import { serviceError } from "../utils/serviceResponse.js";

export const checkPermission = (module, action, options = {}) => {
  return async (req, res, next) => {
    try {
      const user = req.session?.user;

      // 🔒 Auth Check
      if (!user) {
        return serviceError(res, "User not authenticated", 401);
      }

      const role = user.role?.toLowerCase();
      const modulePermissions = PERMISSIONS[role]?.[module] || [];

      // 🔒 Role Permission Check
      if (!modulePermissions.includes(action)) {
        return serviceError(
          res,
          `Forbidden: ${role} cannot ${action} ${module}`,
          403
        );
      }

      // 🔒 Ownership Check (optional)
      if (options.checkOwner && options.model) {
        const record = await options.model.findByPk(req.params.id);

        if (!record) {
          return serviceError(res, "Resource not found", 404);
        }

        if (role !== "admin" && record.userId !== user.id) {
          return serviceError(res, "Not your resource", 403);
        }

        req.record = record; // pass to controller
      }

      // Attach user to request
      req.user = user;

      next();
    } catch (err) {
      console.error("Permission Middleware Error:", err);
      return serviceError(res, "Permission error", 500);
    }
  };
};