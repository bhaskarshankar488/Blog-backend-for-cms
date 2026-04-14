import Joi from "joi";

export const createUserSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),

  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  role: Joi.string()
    .valid("viewer", "analyst", "admin")
    .optional()
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required()
});

export const updateUserSchema = Joi.object({
  name: Joi.string().min(3).max(50).optional(),

  email: Joi.string().email().optional(),

  password: Joi.string().min(6).optional(),

  role: Joi.string()
    .valid("admin", "viewer","analyst") 
    .optional(),

  status: Joi.string()
    .valid("active", "inactive")
    .optional(),
});

export const updateRoleSchema = Joi.object({
  role: Joi.string()
    .valid("admin", "viewer", "analyst")
    .required()
    .messages({
      "any.only": "Role must be admin, viewer, or analyst",
      "any.required": "Role is required",
    }),
});

export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("active", "inactive")
    .required()
});

export const getUserByIdSchema = Joi.object({
 id: Joi.string().length(24).hex().required()
});