import { Tool } from "../../../models/tool.model.js";
import { ToolSection } from "../models/toolSectionSchema.js";
import { DEFAULT_TOOL_SECTIONS } from "../constants/defaultToolSections.js";

export const createTool = async (payload) => {
  console.log("Creating tool");

  const tool = await Tool.create(payload);

  console.log("Tool created:", tool._id);

  console.log(
    "DEFAULT_TOOL_SECTIONS:",
    DEFAULT_TOOL_SECTIONS
  );

  const sections = DEFAULT_TOOL_SECTIONS.map(
    (section) => ({
      ...section,
      toolId: tool._id,
    })
  );

  console.log(
    "Sections Data:",
    JSON.stringify(sections, null, 2)
  );

  try {
    await ToolSection.insertMany(sections);

    console.log("Sections created");
  } catch (error) {
    console.log("Insert Error:", error);
    console.log(
      "Validation Errors:",
      error.errors
    );

    throw error;
  }

  return tool;
};