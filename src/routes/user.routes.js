import express from "express";
import {
  createUser,
  updateUser,
  updateUserRole,
  deleteUser,
  updateUserStatus,
  getUsers,
  getUserById,
} from "../controllers/user.controller.js";

import { validate } from "../middlewares/validate.middleware.js";
import { isAuthenticated } from "../middlewares/auth.middleware.js";
import { checkPermission } from "../middlewares/permission.middleware.js";

import {
  createUserSchema,
  updateUserSchema,
  updateRoleSchema,
  updateStatusSchema,
  getUserByIdSchema
} from "../validators/user.validator.js";

const router = express.Router();

// CREATE USER
router.post(
  "/", // 🔥 REST improvement (optional)
  isAuthenticated,
  checkPermission("users", "create"),
  validate(createUserSchema),
  createUser
);

// UPDATE USER
router.put(
  "/:id",
  isAuthenticated,
  checkPermission("users", "update"),
  validate(getUserByIdSchema, "params"), // ✅ FIX
  validate(updateUserSchema),
  updateUser
);

// UPDATE ROLE
router.patch(
  "/:id/role",
  isAuthenticated,
  checkPermission("users", "update"),
  validate(getUserByIdSchema, "params"), // ✅ FIX
  validate(updateRoleSchema),
  updateUserRole
);

// DELETE USER
router.delete(
  "/:id",
  isAuthenticated,
  checkPermission("users", "delete"),
  validate(getUserByIdSchema, "params"), // ✅ FIX
  deleteUser
);

// UPDATE STATUS
router.patch(
  "/:id/status",
  isAuthenticated,
  checkPermission("users", "update"),
  validate(getUserByIdSchema, "params"), // ✅ FIX
  validate(updateStatusSchema),
  updateUserStatus
);

// GET ONE
router.get(
  "/:id",
  isAuthenticated,
  checkPermission("users", "read"),
  validate(getUserByIdSchema, "params"),
  getUserById
);

// GET ALL
router.get(
  "/",
  isAuthenticated,
  checkPermission("users", "read"),
  getUsers
);


export default router;