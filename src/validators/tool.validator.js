import Joi from "joi";

export const createToolSchema = Joi.object({
  name: Joi.string().required(),

  slug: Joi.string()
    .regex(/^[a-z0-9-]+$/)
    .required(),

  image: Joi.any().optional(),

  brand: Joi.string().allow("", null),

  tags: Joi.array()
    .items(Joi.string())
    .max(3)
    .optional(),

  globalDescription: Joi.string().allow("", null),

  link: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Link is required",
      "string.uri": "Link must be a valid URL",
    }),
});
// Mongo ObjectId validation
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// PARAM VALIDATION
export const toolIdSchema = Joi.object({
  id: objectId.required(),
});

// UPDATE TOOL
export const updateToolSchema = Joi.object({
  name: Joi.string().optional(),

  slug: Joi.string()
    .regex(/^[a-z0-9-]+$/)
    .optional(),

  image: Joi.any().optional(),

  brand: Joi.string().allow("", null),

  globalDescription: Joi.string().allow("", null),

  tags: Joi.array()
    .items(Joi.string())
    .max(3)
    .optional(),

  link: Joi.string()
    .uri()
    .required()
    .messages({
      "string.empty": "Link is required",
      "string.uri": "Link must be a valid URL",
    }),
});

export const getToolsSchema = Joi.object({
  search: Joi.string().allow("", null),
});