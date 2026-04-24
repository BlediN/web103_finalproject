import express from "express";
import cors from "cors";

import companyRoutes from "./routes/companies.js";
import entryRoutes from "./routes/entries.js";
import resetRoutes from "./routes/reset.js";
import tagRoutes from "./routes/tags.js";
import userProfileRoutes from "./routes/user-profiles.js";

import userRoutes from "./routes/users.js";
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("LayoffLens API is running.");
});

app.use("/api/companies", companyRoutes);
app.use("/api/entries", entryRoutes);
app.use("/api/reset", resetRoutes);
app.use("/api/tags", tagRoutes);
app.use("/api/user-profiles", userProfileRoutes);

app.use("/api/users", userRoutes);
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});