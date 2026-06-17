import Joi from "joi";

const objectId =
  Joi.string().regex(
    /^[0-9a-fA-F]{24}$/
  );
export const toolFullSchema =
  Joi.object({
    toolId: objectId.required(),
  });


export const toolContentIdSchema =
  Joi.object({
    toolId:
      objectId.required(),
  });

export const createToolContentSchema =
  Joi.object({
    toolId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),

    hero: Joi.object().optional(),

    coreCapabilities:
      Joi.array().optional(),

    prosCons:
      Joi.object().optional(),

    latestBlogs:
      Joi.array().optional(),

    engineAndValue:
      Joi.array().optional(),

    underTheHood:
      Joi.array().optional(),

    features:
      Joi.array().optional(),

    bestFor:
      Joi.array().optional(),

    performanceSection:
      Joi.object().optional(),

    pricing:
      Joi.object().optional(),

    faqs:
      Joi.array().optional(),

    ctaBanner:
      Joi.object().optional(),
  });

export const updateToolContentSchema =
  createToolContentSchema.fork(
    ["toolId"],
    (field) => field.optional()
  );