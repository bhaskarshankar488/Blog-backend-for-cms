import dotenv from "dotenv";
import { connectDB } from "../src/config/db.js";
import { seedAdmin } from "./seedAdmin.js";

dotenv.config();

const runSetup = async () => {
  try {
    console.log("🚀 Starting MongoDB setup...");

    // STEP 1: Connect DB (auto creates DB)
    await connectDB();

    // STEP 2: Seed Admin
    await seedAdmin();

    console.log(" Setup completed successfully");

    process.exit(0);
  } catch (error) {
    console.error(" Setup failed:", error);
    process.exit(1);
  }
};

runSetup();