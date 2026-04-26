import { generateSchema } from "../common/schema.service.js";

export const buildPageResponse = (page, category, mergedTools) => {
  return {
    meta: page.meta || {},

    _id: page._id,
    title: page.title,
    slug: page.slug,

    category: {
      name: category?.name || "",
      slug: category?.slug || "",
    },

    tools: mergedTools || [],

    faq: page.faq || [],

    content: page.content || "",
  
    status: page.status,
    schema: generateSchema({
      ...page.toObject(),
      tools: mergedTools,
      category: {
        name: category?.name || "",
        slug: category?.slug || "",
      },
    }) || "",
    createdAt: page.createdAt,
    updatedAt: page.updatedAt,
  };
};