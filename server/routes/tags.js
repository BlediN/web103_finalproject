import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get all tags
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM tags ORDER BY name ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
});

// Get tags for a specific entry
router.get("/entry/:entryId", async (req, res) => {
  const { entryId } = req.params;
  try {
    const result = await pool.query(
      `SELECT t.* FROM tags t
       INNER JOIN entry_tags et ON t.id = et.tag_id
       WHERE et.entry_id = $1
       ORDER BY t.name ASC`,
      [entryId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching entry tags:", error);
    res.status(500).json({ error: "Failed to fetch entry tags" });
  }
});

// Create a new tag
router.post("/", async (req, res) => {
  const { name, description } = req.body;

  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "Tag name is required" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tags (name, description) VALUES ($1, $2) RETURNING *",
      [name.trim(), description || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating tag:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Tag already exists" });
    } else {
      res.status(500).json({ error: "Failed to create tag" });
    }
  }
});

// Add tag to entry
router.post("/entry/:entryId/tag/:tagId", async (req, res) => {
  const { entryId, tagId } = req.params;

  try {
    const result = await pool.query(
      "INSERT INTO entry_tags (entry_id, tag_id) VALUES ($1, $2) RETURNING *",
      [entryId, tagId]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error adding tag to entry:", error);
    if (error.code === "23505") {
      res.status(409).json({ error: "Tag already associated with this entry" });
    } else {
      res.status(500).json({ error: "Failed to add tag to entry" });
    }
  }
});

// Remove tag from entry
router.delete("/entry/:entryId/tag/:tagId", async (req, res) => {
  const { entryId, tagId } = req.params;

  try {
    await pool.query(
      "DELETE FROM entry_tags WHERE entry_id = $1 AND tag_id = $2",
      [entryId, tagId]
    );
    res.status(204).send();
  } catch (error) {
    console.error("Error removing tag from entry:", error);
    res.status(500).json({ error: "Failed to remove tag from entry" });
  }
});

export default router;
