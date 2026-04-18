import { Tool } from "../../models/tool.model.js";

export const mergeTools = async (page) => {
  const toolIds = page.tools.map((t) => t.toolId);

  const tools = await Tool.find({ _id: { $in: toolIds } });

  return page.tools.map((t, index) => {
    const tool = tools.find(
      (tool) => tool._id.toString() === t.toolId.toString()
    );

    return {
      name: tool.name,
      image: tool.image,
      brand: tool.brand,
      tags: tool.tags,
      description: t.customDescription || tool.globalDescription,
      rating: t.rating,
      position: index + 1,
    };
  });
};