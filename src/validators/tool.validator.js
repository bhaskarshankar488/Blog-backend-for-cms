import Joi from "joi";
// Mongo ObjectId validation
const objectId = Joi.string().regex(/^[0-9a-fA-F]{24}$/);

// PARAM VALIDATION
export const toolIdSchema = Joi.object({
  id: objectId.required(),
});

export const seoSchema = Joi.object({
  metaTitle: Joi.string()
    .trim()
    .max(60)
    .allow("")
    .messages({
      "string.max":
        "Meta title should not exceed 60 characters",
    }),

  metaDescription: Joi.string()
    .trim()
    .max(160)
    .allow("")
    .messages({
      "string.max":
        "Meta description should not exceed 160 characters",
    }),

  metaKeywords: Joi.array()
    .items(
      Joi.string()
        .trim()
        .max(50)
    )
    .max(10)
    .default([])
    .messages({
      "array.max":
        "Maximum 10 meta keywords allowed",
    }),
}).default({});

export const createToolSchema = Joi.object({
  name: Joi.string().required(),

  slug: Joi.string()
    .regex(/^[a-z0-9-]+$/)
    .required(),

  seo: seoSchema.optional(),

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