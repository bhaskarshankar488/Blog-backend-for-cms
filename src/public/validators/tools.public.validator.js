import Joi from "joi";

export const getToolsPublicSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(100),

  category: Joi.string()
    .trim()
    .optional(),

  pricingLabel: Joi.string()
    .valid("Free", "Freemium", "Paid")
    .optional(),
});