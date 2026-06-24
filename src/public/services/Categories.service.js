import { Category } from "../../models/category.model.js";
import { Page } from "../../models/page.model.js";
import { Tool } from "../../models/tool.model.js";
import { ToolContent } from "../../models/toolContent.model.js";

import { mergeTools } from "../../services/common/merge.service.js";
import { generateSchema } from "../../services/common/schema.service.js";
import { serviceSuccess, serviceError } from "../../utils/serviceResponse.js";
import { buildPageResponse } from "../../services/page/page.response.js";

export const getCategories = async () => {
  const categories = await Category.aggregate([
    // Pages count
    {
      $lookup: {
        from: "pages",
        localField: "_id",
        foreignField: "categoryId",
        as: "pages",
      },
    },

    // Tools count
    {
      $lookup: {
        from: "tools",
        localField: "_id",
        foreignField: "categoryId",
        as: "tools",
      },
    },

    {
      $addFields: {
        totalPages: {
          $size: {
            $filter: {
              input: "$pages",
              as: "page",
              cond: {
                $eq: [
                  "$$page.status",
                  "published",
                ],
              },
            },
          },
        },

        totalTools: {
          $size: "$tools",
        },
      },
    },

    // Tools having ToolContent
    {
      $lookup: {
        from: "toolcontents",
        let: {
          toolIds: "$tools._id",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $in: [
                  "$toolId",
                  "$$toolIds",
                ],
              },
            },
          },
        ],
        as: "toolContents",
      },
    },

    {
      $project: {
        name: 1,
        slug: 1,
        totalPages: 1,
        totalTools: 1,
        totalToolsWithContent: {
          $size: "$toolContents",
        },
      },
    },

    {
      $sort: {
        name: 1,
      },
    },
  ]);

  const summary = {
    totalCategories: categories.length,

    totalPages: categories.reduce(
      (sum, category) =>
        sum + category.totalPages,
      0
    ),

    totalTools: categories.reduce(
      (sum, category) =>
        sum + category.totalTools,
      0
    ),

    totalToolsWithContent:
      categories.reduce(
        (sum, category) =>
          sum +
          category.totalToolsWithContent,
        0
      ),
  };

  return {
    message: "Categories fetched successfully",
    summary,
    data: categories,
  };
};

// export const getCategoryBySlug = async (slug) => {
//   const category = await Category.findOne({
//     slug,
//   })
//     .select(
//       "name slug title description seoTitle seoDescription seoKeywords"
//     )
//     .lean();

//   if (!category) {
//     throw {
//       status: 404,
//       message: "Category not found",
//     };
//   }

//   const pages = await Page.find({
//     categoryId: category._id,
//     status: "published",
//   })
//     .select(
//       "title slug categoryDescription catImage.url createdAt status"
//     )
//     .sort({
//       createdAt: -1,
//     })
//     .lean();

//   return {
//     message: "Category fetched successfully",
//     data: {
//       category,
//       pages,
//     },
//   };
// };

// // GET PUBLIC PAGE
// export const getPageByCategoryAndSlug = async (categorySlug, pageSlug) => {
//   const category = await Category.findOne({ slug: categorySlug });

//   if (!category) {
//     throw serviceError("Category not found", 404);
//   }

//   const page = await Page.findOne({
//     slug: pageSlug,
//     categoryId: category._id,
//     status: "published",
//   });

//   if (!page) {
//     throw serviceError("Page not found", 404);
//   }

//   const mergedTools = await mergeTools(page);

//   const response = buildPageResponse(page, category, mergedTools);

//   return serviceSuccess(response, "Page fetched successfully");
// };

// get tool for tool listing page minimal information

export const getToolsByCategorySlug =
  async (
    categorySlug,
    page,
    limit
  ) => {
    const category =
      await Category.findOne({
        slug: categorySlug,
      }).lean();

    if (!category) {
      const error = new Error(
        "Category not found"
      );

      error.status = 404;

      throw error;
    }

    const query = {
      categoryId: category._id,
    };

    const totalTools =
      await Tool.countDocuments(query);

    let toolQuery = Tool.find(query)
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
      });

    // Apply pagination only if both exist
    if (page && limit) {
      const skip =
        (Number(page) - 1) *
        Number(limit);

      toolQuery = toolQuery
        .skip(skip)
        .limit(Number(limit));
    }

    const tools =
      await toolQuery.lean();

    const formattedTools =
      tools.map((tool) => ({
        name: tool.name,
        slug: tool.slug,
        seo: tool.seo,
        image:
          tool.images?.tool?.url || "",
        brand: tool.brand,
        link: tool.link,
        globalDescription:
          tool.globalDescription,
        pricingLabel:
          tool.pricingLabel,
        ratingValue:
          tool.ratingValue,
        tags: tool.tags,
        createdAt:
          tool.createdAt,
        updatedAt:
          tool.updatedAt,
      }));

    const response = {
      message:
        "Tools fetched successfully",

      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        totalTools,
      },

      data: formattedTools,
    };

    if (page && limit) {
      response.pagination = {
        page: Number(page),
        limit: Number(limit),
        totalItems: totalTools,
        totalPages: Math.ceil(
          totalTools / limit
        ),
      };
    }

    return response;
  };


export const getToolByCategoryAndSlug =
  async (
    categorySlug,
    toolSlug
  ) => {
    const category =
      await Category.findOne({
        slug: categorySlug,
      }).lean();

    if (!category) {
      const error = new Error(
        "Category not found"
      );
      error.status = 404;
      throw error;
    }

    const tool =
      await Tool.findOne({
        slug: toolSlug,
        categoryId: category._id,
      })
        .populate(
          "categoryId",
          "name slug"
        )
        .lean();

    if (!tool) {
      const error = new Error(
        "Tool not found"
      );
      error.status = 404;
      throw error;
    }

    const toolContent =
      await ToolContent.findOne({
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

      image:
        tool.images?.tool?.url || "",

      heroImage:
        tool.images?.hero?.url || "",

      faqImage:
        tool.images?.faq?.url || "",

      brand: tool.brand,

      link: tool.link,

      globalDescription:
        tool.globalDescription,

      whatIsIt:
        tool.whatIsIt,

      pricingLabel:
        tool.pricingLabel,

      ratingValue:
        tool.ratingValue,

      ratingCount:
        tool.ratingCount,

      reviewCount:
        tool.reviewCount,

      tags: tool.tags,

      category: {
        _id:
          tool.categoryId?._id,
        name:
          tool.categoryId?.name,
        slug:
          tool.categoryId?.slug,
      },

      createdAt:
        tool.createdAt,

      updatedAt:
        tool.updatedAt,
    };

    const transformedContent =
      toolContent
        ? {
          ...toolContent,

          alternativeTools:
            toolContent.alternativeTools.map(
              (item) => ({
                _id:
                  item.alternativeId
                    ?._id,

                name:
                  item.alternativeId
                    ?.name,

                slug:
                  item.alternativeId
                    ?.slug,

                image:
                  item
                    .alternativeId
                    ?.images?.tool
                    ?.url || "",

                isSponsored:
                  item.isSponsored,

                position:
                  item.position,
              })
            ),
        }
        : null;

    return {
      message:
        "Tool fetched successfully",

      data: {
        tool:
          transformedTool,

        content:
          transformedContent,
      },
    };
  };

// page list and page data 


export const getPagesByCategorySlug =
  async (
    categorySlug,
    page,
    limit
  ) => {
    const category =
      await Category.findOne({
        slug: categorySlug,
      }).lean();

    if (!category) {
      const error = new Error(
        "Category not found"
      );

      error.status = 404;
      throw error;
    }

    const query = {
      categoryId: category._id,
    };

    const totalPages =
      await Page.countDocuments(
        query
      );

    let pageQuery = Page.find(query)
      .select({
        title: 1,
        slug: 1,
        categoryDescription: 1,
        catImage: 1,
 
        status: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({
        createdAt: -1,
      });

    // Optional Pagination
    if (page && limit) {
      const skip =
        (Number(page) - 1) *
        Number(limit);

      pageQuery = pageQuery
        .skip(skip)
        .limit(Number(limit));
    }

    const pages =
      await pageQuery.lean();

    const transformedPages =
      pages.map((page) => ({
        title: page.title,
        slug: page.slug,

        categoryDescription:
          page.categoryDescription,

        catImage:
          page.catImage || "",

     

        status: page.status,

        createdAt:
          page.createdAt,

        updatedAt:
          page.updatedAt,
      }));

    const response = {
      message:
        "Pages fetched successfully",

      category: {
        _id: category._id,
        name: category.name,
        slug: category.slug,
        totalPages,
      },

      data: transformedPages,
    };

    if (page && limit) {
      response.pagination = {
        page: Number(page),
        limit: Number(limit),
        totalItems: totalPages,
        totalPages: Math.ceil(
          totalPages / limit
        ),
      };
    }

    return response;
  };

