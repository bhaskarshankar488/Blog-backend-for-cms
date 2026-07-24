import Joi from 'joi';

// unknown(false) => any field not listed here causes validation to fail.
// This is the mass-assignment / parameter-pollution guard: attackers cannot
// smuggle extra fields (e.g. isAdmin, role, _id) into the request body.
export const subscribeSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email({ tlds: { allow: true } })
    .max(254)
    .required(),
  captchaToken: Joi.string().trim().min(10).max(2048).required(),
})
  .required()
  .unknown(false);

export const validateSubscribe = (req, res, next) => {
  // If body-parser failed to produce an object (malformed JSON), req.body may
  // be undefined/empty — Joi will catch this via `.required()` on the object.
  const { error, value } = subscribeSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: error.details.map((d) => d.message.replace(/"/g, '')),
    });
  }

  // Overwrite req.body with the sanitized/coerced value (trimmed, lowercased)
  req.body = value;
  next();
};
