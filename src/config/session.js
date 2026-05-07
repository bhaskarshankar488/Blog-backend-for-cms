import session from "express-session";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";

dotenv.config();

const isProd = process.env.NODE_ENV === "production";

export const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET || "mysecretkey",

  resave: false,
  saveUninitialized: false,

  rolling: true,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
    touchAfter: 3600,  // 1 hours
  }),

  cookie: {
    secure: isProd,
    httpOnly: true,
    sameSite: isProd ? "none" : "lax",

    // 24 hours
    maxAge: 1000 * 60 * 60 * 24,
  },
});