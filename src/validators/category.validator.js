import Joi from "joi";

const objectId = Joi.string().hex().length(24);

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required(),
  slug: Joi.string().trim().required(),
  title: Joi.string().allow(""),
  description: Joi.string().allow(""),
  seoTitle: Joi.string().allow(""),
  seoDescription: Joi.string().allow(""),
  seoKeywords: Joi.array().items(Joi.string())
});

export const updateCategorySchema =
  createCategorySchema
    .fork(["name", "slug"], schema =>
      schema.optional()
    )
    .min(1);

// PARAM ID
export const categoryIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});