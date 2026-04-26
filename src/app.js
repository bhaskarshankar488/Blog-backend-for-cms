import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/user.routes.js";
import loginRoutes from "./routes/auth.routes.js";
import toolRoutes from "./routes/tool.routes.js";  
import pageRoutes from "./routes/page.routes.js"; 
import revalidateRoutes from "./routes/revalidate.routes.js";  
import { sessionMiddleware} from "./config/session.js";
import categoryRoutes from "./routes/category.routes.js";
import dotenv from "dotenv";

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  process.env.FRONTEND_URL_CMS,
];

const app = express();

app.set("trust proxy", 1); 

app.use(sessionMiddleware);
// Middlewares
app.use(express.json());

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
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
app.use("/api/categories", categoryRoutes); 
app.use("/api/revalidate", revalidateRoutes); 

export default app;