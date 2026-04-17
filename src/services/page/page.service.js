import { Page } from "../../models/page.model.js";
import { mergeTools } from "../common/merge.service.js";
import { generateSchema } from "../common/schema.service.js";
import { serviceSuccess, serviceError } from "../../utils/serviceResponse.js";

// CREATE PAGE
export const createPage = async (data) => {
  const existing = await Page.findOne({ slug: data.slug });

  if (existing) {
    throw serviceError("Page already exists", 409);
  }

  const page = await Page.create(data);

  return serviceSuccess(page, "Page created successfully");
};

// GET PUBLIC PAGE
export const getPageBySlug = async (slug) => {
  const page = await Page.findOne({
    slug,
    status: "published",
  });

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  const mergedTools = await mergeTools(page);

  const response = {
    ...page.toObject(),
    tools: mergedTools,
    schema: generateSchema({
      ...page.toObject(),
      tools: mergedTools,
    }),
  };

  return serviceSuccess(response, "Page fetched successfully");
};

// UPDATE PAGE
export const updatePage = async (pageId, data) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  const updated = await Page.findByIdAndUpdate(pageId, data, {
    new: true,
  });

  return serviceSuccess(updated, "Page updated successfully");
};

// DELETE PAGE
export const deletePage = async (pageId) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  await Page.findByIdAndDelete(pageId);

  return serviceSuccess(null, "Page deleted successfully");
};

// UPDATE STATUS
export const updatePageStatus = async (pageId, status) => {
  const page = await Page.findById(pageId);

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  if (page.status === status) {
    return serviceSuccess(page, `Page already ${status}`);
  }

  page.status = status;
  await page.save();

  return serviceSuccess(page, "Page status updated successfully");
};

// PREVIEW PAGE (NO STATUS FILTER)
export const previewPageBySlug = async (slug) => {
  const page = await Page.findOne({ slug });

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  const mergedTools = await mergeTools(page);

  const response = {
    ...page.toObject(),
    tools: mergedTools,
    schema: generateSchema({
      ...page.toObject(),
      tools: mergedTools,
    }),
  };

  return serviceSuccess(response, "Preview page fetched successfully");
};

// GET ALL PAGES (ADMIN)
export const getPages = async () => {
  const pages = await Page.find()
    .select("title slug status createdAt updatedAt") 
    .sort({ createdAt: -1 });

  return serviceSuccess(pages, "Pages fetched successfully");
};

export const getPageById = async (id) => {
  const page = await Page.findById(id);

  if (!page) {
    throw serviceError("Page not found", 404);
  }

  return serviceSuccess(page, "Page fetched successfully");
};