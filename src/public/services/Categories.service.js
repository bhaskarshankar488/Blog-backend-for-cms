import { Category } from "../../models/category.model.js";
import { Page } from "../../models/page.model.js";

import { mergeTools } from "../../services/common/merge.service.js";
import { generateSchema } from "../../services/common/schema.service.js";
import { serviceSuccess, serviceError } from "../../utils/serviceResponse.js";
import { buildPageResponse } from "../../services/page/page.response.js";

export const getCategories = async () => {
  const categories = await Category.aggregate([
    {
      $lookup: {
        from: "pages",
        let: { categoryId: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: [
                      "$categoryId",
                      "$$categoryId",
                    ],
                  },
                  {
                    $eq: [
                      "$status",
                      "published",
                    ],
                  },
                ],
              },
            },
          },
          {
            $count: "totalPages",
          },
        ],
        as: "pageStats",
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        slug: 1,
        totalPages: {
          $ifNull: [
            {
              $arrayElemAt: [
                "$pageStats.totalPages",
                0,
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $sort: { name: 1 },
    },
  ]);

  return {
    message: "Categories fetched successfully",
    data: categories,
  };
};

export const getCategoryBySlug = async (slug) => {
  const category = await Category.findOne({
    slug,
  })
    .select(
      "name slug title description seoTitle seoDescription seoKeywords"
    )
    .lean();

  if (!category) {
    throw {
      status: 404,
      message: "Category not found",
    };
  }

  const pages = await Page.find({
    categoryId: category._id,
    status: "published",
  })
    .select(
      "title slug categoryDescription catImage.url createdAt status"
    )
    .sort({
      createdAt: -1,
    })
    .lean();

  return {
    message: "Category fetched successfully",
    data: {
      category,
      pages,
    },
  };
};

// GET PUBLIC PAGE
export const getPageByCategoryAndSlug = async (categorySlug, pageSlug) => {
  const category = await Category.findOne({ slug: categorySlug });

  if (!category) {
    throw serviceError("Category not found", 404);
  }

  const page = await Page.findOne({
    slug: pageSlug,
    categoryId: category._id,
    status: "published",
  });

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  const mergedTools = await mergeTools(page);

  const response = buildPageResponse(page, category, mergedTools);

  return serviceSuccess(response, "Page fetched successfully");
};