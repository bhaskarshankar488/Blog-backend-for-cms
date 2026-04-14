import { User } from "../models/user.model.js";


export const authorizeRoles = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const sessionUser = req.session.user;

      if (!sessionUser) {
        return res.status(401).json({
          message: "Unauthorized - Please login first",
        });
      }

      const user = await User.findByPk(sessionUser.id);
      
      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      const userRole = user.role.toLowerCase().trim();
      const normalizedRoles = allowedRoles.map(r => r.toLowerCase());

      if (!normalizedRoles.includes(userRole)) {
        return res.status(403).json({
          message: `Forbidden - Only [${allowedRoles.join(", ")}] can access`,
        });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Authorization error",
      });
    }
  };
};