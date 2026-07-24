import Joi from "joi";

export const getSubscribersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),

  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10),

  search: Joi.string()
    .allow("")
    .optional(),
});

export const subscriberIdSchema = Joi.object({
  id: Joi.string()
    .hex()
    .length(24)
    .required(),
});