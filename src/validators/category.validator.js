import Joi from "joi";

const objectId = Joi.string().hex().length(24);

// CREATE
export const createCategorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
});

// UPDATE
export const updateCategorySchema = Joi.object({
  name: Joi.string().optional(),
  slug: Joi.string().optional(),
});

// PARAM ID
export const categoryIdSchema = Joi.object({
  id: objectId.required(),
});