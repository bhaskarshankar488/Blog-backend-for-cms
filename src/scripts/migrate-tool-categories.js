import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import { Tool } from "../models/tool.model.js";

const CATEGORY_IDS = [
  "69f9fedd97c3d094ed4a8e93", // AI Roundups
  "69f9ff2697c3d094ed4a8e95", // Code and Development
  "69f9ff1297c3d094ed4a8e94", // Customer Support and Chatbots
  "69f9fead97c3d094ed4a8e91", // Image and Art
  "6a23ae115d862b3a38951e48", // Marketing
  "69f9fde997c3d094ed4a8e8e", // Productivity And Automation
  "69f9fe8e97c3d094ed4a8e90", // Text and Writing
  "69f9ff3897c3d094ed4a8e96", // Video and Animation
  "69f9febe97c3d094ed4a8e92", // Voice and Audio
];

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const tools = await Tool.find().select("_id");

    console.log(`Found ${tools.length} tools`);

    const operations = tools.map(
      (tool, index) => ({
        updateOne: {
          filter: { _id: tool._id },
          update: {
            $set: {
              categoryId:
                CATEGORY_IDS[
                  index % CATEGORY_IDS.length
                ],
            },
          },
        },
      })
    );

    const result =
      await Tool.bulkWrite(operations);

    console.log(
      "Migration completed"
    );

    console.log(result);

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

migrate();