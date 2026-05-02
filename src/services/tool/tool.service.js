import { Page } from "../../models/page.model.js";
import { Tool } from "../../models/tool.model.js";
import { serviceSuccess, serviceError } from "../../utils/serviceResponse.js";

// CREATE TOOL
export const createTool = async (data) => {
  const existing = await Tool.findOne({ slug: data.slug });

  if (existing) {
    throw serviceError("Tool already exists", 409);
  }

  const tool = await Tool.create(data);

  return serviceSuccess(tool, "Tool created successfully");
};

// GET TOOLS (SEARCH)
export const getTools = async (search) => {
  const query = search
    ? { name: { $regex: search, $options: "i" } }
    : {};

   const tools = await Tool.find(query)
    .select("name slug image brand") // ✅ only needed fields
    .limit(20); // ✅ limit for performance

  return serviceSuccess(tools, "Tools fetched successfully");
};

export const updateTool = async (id, data) => {
  const tool = await Tool.findById(id);

  if (!tool) {
    throw serviceError("Tool not found", 404);
  }

  const updated = await Tool.findByIdAndUpdate(id, data, { new: true });

  return serviceSuccess(updated, "Tool updated successfully");
};

export const deleteTool = async (id) => {
  // ✅ Check tool exists
  const tool = await Tool.findById(id);

  if (!tool) {
    throw serviceError("Tool not found", 404);
  }

  // ✅ Find pages using this tool
  const attachedPages = await Page.find(
    {
      "tools.toolId": id,
    },
    {
      title: 1,
      slug: 1,
    }
  );

  // ✅ If attached to pages → prevent delete
  if (attachedPages.length > 0) {
  const pageTitles = attachedPages.map((page) => {
    return page.title || page.slug || "Untitled Page";
  });

  throw serviceError(
    `Cannot delete tool. This tool is attached to ${attachedPages.length} page(s): ${pageTitles.join(
      ", "
    )}`,
    400
  );
}

  // ✅ Delete tool if not attached anywhere
  await Tool.findByIdAndDelete(id);

  return serviceSuccess(
    null,
    "Tool deleted successfully"
  );
};

export const getToolById = async (id) => {
  const tool = await Tool.findById(id);

  if (!tool) {
    throw serviceError("Tool not found", 404);
  }

  return serviceSuccess(tool, "Tool fetched successfully");
};