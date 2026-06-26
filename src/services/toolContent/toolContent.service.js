import { ToolContent }
  from "../../models/toolContent.model.js";
import { Tool }
  from "../../models/tool.model.js";

import {
  serviceSuccess,
  serviceError,
} from "../../utils/serviceResponse.js";

export const createToolContent =
  async (data) => {

    const existing =
      await ToolContent.findOne({
        toolId: data.toolId,
      });

    if (existing) {
      throw serviceError(
        "Tool content already exists",
        409
      );
    }

    const content =
      await ToolContent.create(data);

    return serviceSuccess(
      content,
      "Tool content created"
    );
  };

export const updateToolContent =
  async (toolId, data) => {

    const content =
      await ToolContent.findOneAndUpdate(
        { toolId },
        data,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

    return serviceSuccess(
      content,
      "Tool content updated"
    );
  };

export const getToolContent = async (
  toolId
) => {
  const content =
    await ToolContent.findOne({
      toolId,
    }).populate({
      path:
        "alternativeTools.alternativeId",

      select:
        "name slug brand images.tool.url",
    });

  if (!content) {
    throw serviceError(
      "Tool content not found",
      404
    );
  }

  return serviceSuccess(
    content,
    "Tool content fetched successfully"
  );
};


export const getToolWithContent =
  async (toolId) => {

    const tool =
      await Tool.findById(toolId);

    if (!tool) {
      throw serviceError(
        "Tool not found",
        404
      );
    }

    const content =
      await ToolContent.findOne({
        toolId
      });

    return serviceSuccess(
      {
        tool,
        content
      },
      "Tool fetched successfully"
    );
  };

