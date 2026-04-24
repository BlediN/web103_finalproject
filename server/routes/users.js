import express from "express";
import crypto from "crypto";
import pool from "../config/database.js";

const router = express.Router();

const HASH_ITERATIONS = 100000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

const hashPassword = (password, salt) =>
  crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

const safeUser = (row) => ({
  id: row.id,
  username: row.username,
  email: row.email,
  created_at: row.created_at,
});

const ensureAuthColumns = async () => {
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email VARCHAR,
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR,
    ADD COLUMN IF NOT EXISTS password_salt VARCHAR;
  `);
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (!email || !email.trim()) {
    return res.status(400).json({ error: "Email is required." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  if (password.length < 4) {
    return res.status(400).json({ error: "Password must be at least 4 characters." });
  }

  try {
    await ensureAuthColumns();

    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    const duplicateCheck = await pool.query(
      "SELECT id FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2) LIMIT 1",
      [normalizedUsername, normalizedEmail]
    );

    if (duplicateCheck.rows.length > 0) {
      return res.status(409).json({ error: "Username or email already exists." });
    }

    const salt = crypto.randomBytes(16).toString("hex");
    const passwordHash = hashPassword(password, salt);

    const result = await pool.query(
      `INSERT INTO users (github_id, username, email, password_hash, password_salt, avatar_url, is_admin)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, username, email, created_at`,
      [
        `local_${Date.now()}`,
        normalizedUsername,
        normalizedEmail,
        passwordHash,
        salt,
        null,
        false,
      ]
    );

    return res.status(201).json({ user: safeUser(result.rows[0]) });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !username.trim()) {
    return res.status(400).json({ error: "Username is required." });
  }

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  try {
    await ensureAuthColumns();

    const normalizedUsername = username.trim();
    const result = await pool.query(
      `SELECT id, username, email, password_hash, password_salt, created_at
       FROM users
       WHERE LOWER(username) = LOWER($1)
       LIMIT 1`,
      [normalizedUsername]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    const user = result.rows[0];
    if (!user.password_hash || !user.password_salt) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    const inputHash = hashPassword(password, user.password_salt);
    if (inputHash !== user.password_hash) {
      return res.status(401).json({ error: "Invalid username or password." });
    }

    return res.status(200).json({ user: safeUser(user) });
  } catch (error) {
    console.error("Error logging in user:", error);
    return res.status(500).json({ error: "Failed to log in." });
  }
});

router.get("/", async (req, res) => {
  try {
    await ensureAuthColumns();
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users ORDER BY created_at DESC"
    );
    return res.json(result.rows);
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ error: "Failed to fetch users" });
  }
});

router.get("/by-username/:username", async (req, res) => {
  const { username } = req.params;

  try {
    await ensureAuthColumns();
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE LOWER(username) = LOWER($1)",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    await ensureAuthColumns();
    const result = await pool.query(
      "SELECT id, username, email, created_at FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

export default router;
