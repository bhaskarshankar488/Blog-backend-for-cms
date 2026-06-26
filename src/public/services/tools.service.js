import { Tool } from "../../models/tool.model.js";
import { ToolContent } from "../../models/toolContent.model.js";

export const getTools = async (page = 1, limit = 100) => {
  page = Number(page) || 1;
  limit = Number(limit) || 100;

  // Maximum 100 records per request
  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;

  const totalTools = await Tool.countDocuments();

  const tools = await Tool.find()
    .select({
      name: 1,
      slug: 1,
      seo: 1,
      "images.tool.url": 1,
      brand: 1,
      link: 1,
      globalDescription: 1,
      pricingLabel: 1,
      ratingValue: 1,
      tags: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .skip(skip)
    .limit(limit)
    .lean();

  const formattedTools = tools.map((tool) => ({
    name: tool.name,
    slug: tool.slug,
    image: tool.images?.tool?.url || "",
    brand: tool.brand,
    link: tool.link,
    globalDescription: tool.globalDescription,
    pricingLabel: tool.pricingLabel,
    ratingValue: tool.ratingValue,
    tags: tool.tags,
    createdAt: tool.createdAt,
    updatedAt: tool.updatedAt,
  }));

return {
  message: "Tools fetched successfully",
  totalTools,
  data: formattedTools,
  pagination: {
    page,
    limit,
    totalItems: totalTools,
    totalPages: Math.ceil(totalTools / limit),
    hasNextPage: page < Math.ceil(totalTools / limit),
    hasPreviousPage: page > 1,
  },
};
};

//get tool wuth cintentent single tool

export const getToolBySlug = async (toolSlug) => {
  const tool = await Tool.findOne({
    slug: toolSlug,
  })
    .populate("categoryId", "name slug")
    .lean();

  if (!tool) {
    const error = new Error("Tool not found");
    error.status = 404;
    throw error;
  }

  const toolContent = await ToolContent.findOne({
    toolId: tool._id,
  })
    .populate(
      "alternativeTools.alternativeId",
      "name slug images.tool.url"
    )
    .lean();

  const transformedTool = {
    _id: tool._id,
    name: tool.name,
    slug: tool.slug,
    seo: tool.seo,

    image: tool.images?.tool?.url || "",
    heroImage: tool.images?.hero?.url || "",
    faqImage: tool.images?.faq?.url || "",

    brand: tool.brand,
    link: tool.link,
    globalDescription: tool.globalDescription,
    whatIsIt: tool.whatIsIt,
    pricingLabel: tool.pricingLabel,

    ratingValue: tool.ratingValue,
    ratingCount: tool.ratingCount,
    reviewCount: tool.reviewCount,

    tags: tool.tags,

    category: {
      _id: tool.categoryId?._id,
      name: tool.categoryId?.name,
      slug: tool.categoryId?.slug,
    },

    createdAt: tool.createdAt,
    updatedAt: tool.updatedAt,
  };

  const transformedContent = toolContent
    ? {
        ...toolContent,
        alternativeTools: toolContent.alternativeTools.map((item) => ({
          _id: item.alternativeId?._id,
          name: item.alternativeId?.name,
          slug: item.alternativeId?.slug,
          image: item.alternativeId?.images?.tool?.url || "",
          isSponsored: item.isSponsored,
          position: item.position,
        })),
      }
    : null;

  return {
    message: "Tool fetched successfully",
    data: {
      tool: transformedTool,
      content: transformedContent,
    },
  };
};