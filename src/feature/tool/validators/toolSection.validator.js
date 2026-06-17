import Joi from "joi";

export const createSectionSchema = Joi.object({
  toolId: Joi.string().required(),

  key: Joi.string().required(),

  title: Joi.string().required(),

  type: Joi.string()
    .valid(
      "card_grid",
      "accordion",
      "metrics",
      "blog_list",
      "comparison",
      "logo_grid",
      "custom"
    )
    .required(),

  description: Joi.string().allow(""),

  order: Joi.number().default(0),
});