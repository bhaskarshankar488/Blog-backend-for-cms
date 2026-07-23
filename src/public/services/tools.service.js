import { Tool } from "../../models/tool.model.js";
import { ToolContent } from "../../models/toolContent.model.js";
import { Category } from "../../models/category.model.js";
import { ToolReview } from "../../models/toolReview.model.js";

export const getTools = async ({
  page = 1,
  limit = 100,
  category,
  pricingLabel,
  search,
}) => {
  page = Number(page) || 1;
  limit = Number(limit) || 100;

  // Maximum 100 records per request
  limit = Math.min(limit, 100);

  const skip = (page - 1) * limit;

  const query = {};
  const filters = {};

  // Category Filter
  if (category) {
    const categoryDoc = await Category.findOne({
      slug: category,
    }).select("_id name slug");

    if (!categoryDoc) {
      const error = new Error("Category not found");
      error.status = 404;
      throw error;
    }

    query.categoryId = categoryDoc._id;

    filters.category = {
      name: categoryDoc.name,
      slug: categoryDoc.slug,
    };
  }

  // Pricing Filter
  if (pricingLabel) {
    query.pricingLabel = pricingLabel;

    filters.pricingLabel = pricingLabel;
  }

  // Search Filter
  if (search) {
    query.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        brand: {
          $regex: search,
          $options: "i",
        },
      },
    ];

    filters.search = search;
  }

  const totalTools = await Tool.countDocuments(query);

  const tools = await Tool.find(query)
    .populate("categoryId", "_id name slug")
    .select({
      name: 1,
      slug: 1,
      "images.tool.url": 1,
      brand: 1,
      link: 1,
      globalDescription: 1,
      pricingLabel: 1,
      ratingValue: 1,
      tags: 1,
      categoryId: 1,
      createdAt: 1,
      updatedAt: 1,
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const formattedTools = tools.map((tool) => ({
    name: tool.name,
    slug: tool.slug,

    category: {
      _id: tool.categoryId?._id,
      name: tool.categoryId?.name,
      slug: tool.categoryId?.slug,
    },

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

    filters,

    totalTools,

    pagination: {
      page,
      limit,
      totalItems: totalTools,
      totalPages: Math.ceil(totalTools / limit),
      hasNextPage: page < Math.ceil(totalTools / limit),
      hasPreviousPage: page > 1,
    },

    data: formattedTools,
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

  if (!toolContent) {
    const error = new Error("toolContent not found");
    error.status = 404;
    throw error;
  }

  const reviewSummary = await ToolReview.aggregate([
    {
      $match: {
        toolId: tool._id,
      },
    },
    {
      $facet: {
        stats: [
          {
            $group: {
              _id: null,
              averageRating: { $avg: "$rating" },
              totalReviews: { $sum: 1 },
            },
          },
        ],
        breakdown: [
          {
            $group: {
              _id: "$rating",
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const stats = reviewSummary[0].stats[0] || {
    averageRating: 0,
    totalReviews: 0,
  };

  const ratingBreakdown = {
    5: 0,
    4: 0,
    3: 0,
    2: 0,
    1: 0,
  };

  reviewSummary[0].breakdown.forEach(({ _id, count }) => {
    ratingBreakdown[_id] = count;
  });

  const finalReviewSummary = {
    averageRating: Number(stats.averageRating.toFixed(1)),
    totalReviews: stats.totalReviews,
    ratingBreakdown,
  };

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
    ProductDescription: tool.ProductDescription,
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
      reviews: finalReviewSummary,
    },
  };
};