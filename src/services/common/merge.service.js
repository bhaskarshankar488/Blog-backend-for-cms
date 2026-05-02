import { Tool } from "../../models/tool.model.js";
import { slugify } from "../../utils/slugify.js";

export const mergeTools = async (page) => {
  const toolIds = page.tools.map((t) => t.toolId);

  const tools = await Tool.find({ _id: { $in: toolIds } });

  return page.tools.map((t, index) => {
    const tool = tools.find(
      (tool) => tool._id.toString() === t.toolId.toString()
    );

    return {
      name: tool.name,
      slug: slugify(tool.name),
      image: tool.image.url,
      brand: tool.brand,
      tags: tool.tags,
      customDescription: t.customDescription || tool.globalDescription,
      reviews: t.reviewCount || 100, 
      position: t.position || index + 1,
      rating: t.ratingValue,
      link: tool?.link || "#"
    };
  });
};