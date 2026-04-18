import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("<h1>LayoffLens API running</h1>");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});