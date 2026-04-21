import express from "express";
import cors from "cors";
import entriesRoutes from "./routes/entries.js";
import companiesRoutes from "./routes/companies.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("LayoffLens API is running");
});

app.use("/api/entries", entriesRoutes);
app.use("/api/companies", companiesRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});