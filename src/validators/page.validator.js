import Joi from "joi";

// 🔹 COMMON
const objectId = Joi.string().hex().length(24);

// CREATE PAGE
export const createPageSchema = Joi.object({
  title: Joi.string().required(),
  pageDescription: Joi.string().required(),

  slug: Joi.string().required(),
  categoryId: objectId.required(),

  meta: Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    keywords: Joi.array().items(Joi.string()),
  }).required(),

  tools: Joi.array().items(
    Joi.object({
      toolId: objectId.required(),
      customDescription: Joi.string().allow(""),
      rating: Joi.number().min(0).max(5),
      reviews: Joi.number().optional(),
      position: Joi.number().optional()
    })
  ),

  faq: Joi.array().items(
    Joi.object({
      question: Joi.string().required(),
      answer: Joi.string().required(),
    })
  ),
content: Joi.string().allow("").optional(),

  status: Joi.string().valid("draft", "published", "unpublished"),
});

// UPDATE PAGE
export const updatePageSchema = createPageSchema.fork(
  ["title", "slug", "meta"],
  (field) => field.optional()
);

// STATUS UPDATE
export const updatePageStatusSchema = Joi.object({
  status: Joi.string()
    .valid("draft", "published", "unpublished")
    .required(),
});

// PARAM VALIDATION
export const getPageByIdSchema = Joi.object({
  id: objectId.required(),
});

// STATUS UPDATE
export const updateStatusSchema = Joi.object({
  status: Joi.string()
    .valid("draft", "published", "unpublished")
    .required(),
});

// PARAM VALIDATION
export const pageIdSchema = Joi.object({
  id: objectId.required(),
});