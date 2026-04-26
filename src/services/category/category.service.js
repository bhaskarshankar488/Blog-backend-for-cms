import { Page } from "../../models/page.model.js";
import { Category } from "../../models/category.model.js";
import { serviceSuccess, serviceError } from "../../utils/serviceResponse.js";

// CREATE
export const createCategory = async (data) => {
  const existing = await Category.findOne({ slug: data.slug });

  if (existing) {
    throw serviceError("Category already exists", 409);
  }

  const category = await Category.create(data);``

  return serviceSuccess(category, "Category created successfully");
};

// GET ALL
export const getCategories = async () => {
  const categories = await Category.find().sort({ createdAt: -1 });

  return serviceSuccess(categories, "Categories fetched successfully");
};

// UPDATE (rename)
export const updateCategory = async (id, data) => {
  const category = await Category.findById(id);

  if (!category) {
    throw serviceError("Category not found", 404);
  }

  const updated = await Category.findByIdAndUpdate(id, data, {
    new: true,
  });

  return serviceSuccess(updated, "Category updated successfully");
};

// DELETE
export const deleteCategory = async (id) => {

    const pages = await Page.countDocuments({ categoryId: id });

    if (pages > 0) {
        throw serviceError("Category is used by pages", 400);
    }

  const category = await Category.findById(id);

  if (!category) {
    throw serviceError("Category not found", 404);
  }

  await Category.findByIdAndDelete(id);

  return serviceSuccess({}, "Category deleted successfully");
};
export const getCategoryById = async (id) => {
  const category = await Category.findById(id).select("_id name slug");

  if (!category) {
    throw serviceError("Category not found", 404);
  }

  return serviceSuccess(category, "Category fetched successfully");
};
