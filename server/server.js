import "./config/dotenv.js";
import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./config/passport.js";

import companyRoutes from "./routes/companies.js";
import entryRoutes from "./routes/entries.js";
import resetRoutes from "./routes/reset.js";
import statsRoutes from "./routes/stats.js";
import tagRoutes from "./routes/tags.js";
import userProfileRoutes from "./routes/user-profiles.js";

import userRoutes from "./routes/users.js";
const app = express();
const PORT = process.env.PORT || 3001;
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

configurePassport(passport);

app.use(
  cors({
    origin: CLIENT_URL,
    credentials: true,
  })
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-session-secret-change-me",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
  res.send("LayoffLens API is running.");
});

app.use("/api/companies", companyRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/user-profiles", userProfileRoutes);

app.use("/api/users", userRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});