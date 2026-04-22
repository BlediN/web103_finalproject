import express from "express";
import cors from "cors";

import companyRoutes from "./routes/companies.js";
import entryRoutes from "./routes/entries.js";
import resetRoutes from "./routes/reset.js";

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

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});