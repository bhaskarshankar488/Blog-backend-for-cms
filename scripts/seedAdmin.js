import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { User } from "../src/models/user.model.js";

dotenv.config();

export const seedAdmin = async () => {
  try {
    console.log(" Checking admin...");

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    // ❗ MongoDB syntax (NO 'where')
    const existingAdmin = await User.findOne({
      email,
      role: "admin",
    });

    if (existingAdmin) {
      console.log(" Admin already exists");
      return;
    }

    console.log(" Creating admin...");

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      name: "System Admin",
      email,
      password: hashedPassword,
      role: "admin",
      status: "active",
    });

    console.log("🚀 Admin created successfully");
  } catch (error) {
    console.error(" Admin seed error:", error.message);
  }
};