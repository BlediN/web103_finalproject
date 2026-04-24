import express from "express";
import pool from "../config/database.js";

const router = express.Router();

// Get user profile by user ID (one-to-one)
router.get("/user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User profile not found" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile" });
  }
});

// Create or update user profile (one-to-one)
router.post("/user/:userId", async (req, res) => {
  const { userId } = req.params;
  const { bio, location, company_name, job_title, website } = req.body;

  try {
    // Check if profile exists
    const existingProfile = await pool.query(
      "SELECT * FROM user_profiles WHERE user_id = $1",
      [userId]
    );

    let result;
    if (existingProfile.rows.length > 0) {
      // Update existing profile
      result = await pool.query(
        `UPDATE user_profiles 
         SET bio = $1, location = $2, company_name = $3, job_title = $4, website = $5, updated_at = CURRENT_TIMESTAMP
         WHERE user_id = $6
         RETURNING *`,
        [bio, location, company_name, job_title, website, userId]
      );
    } else {
      // Create new profile
      result = await pool.query(
        `INSERT INTO user_profiles (user_id, bio, location, company_name, job_title, website)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [userId, bio, location, company_name, job_title, website]
      );
    }

    res.status(result.rows.length === 0 || !existingProfile.rows.length ? 201 : 200).json(
      result.rows[0]
    );
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    if (error.code === "23502") {
      res.status(400).json({ error: "User not found" });
    } else {
      res.status(500).json({ error: "Failed to create/update user profile" });
    }
  }
});

export default router;
