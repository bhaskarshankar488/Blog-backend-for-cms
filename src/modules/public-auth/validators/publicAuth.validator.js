import Joi from "joi";

export const googleLoginSchema = Joi.object({
  credential: Joi.string().trim().required(),
});

export const refreshSessionSchema = Joi.object({
  refreshToken: Joi.string().trim().required(),
});

export const emptyBodySchema = Joi.object({}).max(0);
