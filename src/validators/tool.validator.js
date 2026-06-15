import Joi from "joi";
// Mongo ObjectId validation
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// PARAM VALIDATION
export const toolIdSchema = Joi.object({
  id: objectId.required(),
});

export const createToolSchema = Joi.object({
  name: Joi.string().required(),

  slug: Joi.string()
    .regex(/^[a-z0-9-]+$/)
    .required(),

  images: Joi.any().optional(),

  brand: Joi.string().allow("", null).required(),

  link: Joi.string()
    .uri()
    .required(),

  globalDescription: Joi.string()
    .allow("", null),

  // NEW FIELDS
  pricingLabel: Joi.string()
    .allow("", null)
    .optional(),

  whatIsIt: Joi.string()
    .allow("", null)
    .optional(),

  categoryId: objectId.required(),

  tags: Joi.array()
    .items(Joi.string())
    .max(3)
    .optional(),

  ratingValue: Joi.number()
    .min(0)
    .max(5)
    .optional(),

  ratingCount: Joi.number()
    .min(0)
    .optional(),

  reviewCount: Joi.number()
    .min(0)
    .optional(),
});


// UPDATE TOOL
export const updateToolSchema = createToolSchema.fork(
  Object.keys(createToolSchema.describe().keys),
  (field) => field.optional()
);
export const getToolsSchema = Joi.object({
  search: Joi.string().allow("", null),
});