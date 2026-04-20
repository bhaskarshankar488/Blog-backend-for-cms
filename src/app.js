import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import loginRoutes from "./routes/auth.routes.js";
import toolRoutes from "./routes/tool.routes.js";  
import pageRoutes from "./routes/page.routes.js"; 
import revalidateRoutes from "./routes/revalidate.routes.js";  
import { sessionMiddleware } from "./config/session.js";
import dotenv from "dotenv";

const app = express();

app.use(sessionMiddleware);
// Middlewares
app.use(express.json());

app.use(cors({ // or your frontend URL
  origin: process.env.FRONTEND_URL_CMS,
  credentials: true
}));
app.use(morgan("dev"));

// Test route
app.get("/", (req, res) => {
  res.send("API is running 🚀");
});

// Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", loginRoutes);
app.use("/api/tools", toolRoutes);   
app.use("/api/pages", pageRoutes);  
app.use("/api/revalidate", revalidateRoutes); 



export default app;