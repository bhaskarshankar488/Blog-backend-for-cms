import Joi from "joi";

export const createSectionItemSchema = Joi.object({
  sectionId: Joi.string().required(),

  title: Joi.string().required(),

  description: Joi.string().allow(""),

  metadata: Joi.object().default({}),

  order: Joi.number().default(0),
});