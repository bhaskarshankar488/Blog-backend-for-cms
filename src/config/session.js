import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "mysecretkey",
  resave: false,
  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),

  cookie: {
    secure: isProd, // ✅ only true in production
    httpOnly: true,
    sameSite: isProd ? "none" : "lax", // ✅ dynamic
    maxAge: 1000 * 60 * 60,
  },
});