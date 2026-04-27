import express from "express";
import crypto from "crypto";
import passport from "passport";
import pool from "../config/database.js";
import {
  ensureAuthColumns,
  hashPassword,
  safeUser,
} from "../config/passport.js";

const router = express.Router();

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

    const createdUser = safeUser(result.rows[0]);

    req.login(createdUser, (loginError) => {
      if (loginError) {
        console.error("Error creating login session after registration:", loginError);
        return res.status(500).json({ error: "Failed to create login session." });
      }

      return res.status(201).json({ user: createdUser });
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ error: "Failed to register user." });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (error, user, info) => {
    if (error) {
      console.error("Error authenticating user:", error);
      return res.status(500).json({ error: "Failed to log in." });
    }

    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid username or password." });
    }

    req.login(user, (loginError) => {
      if (loginError) {
        console.error("Error creating login session:", loginError);
        return res.status(500).json({ error: "Failed to create login session." });
      }

      return res.status(200).json({ user });
    });
  })(req, res, next);
});

router.post("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      console.error("Error logging out user:", error);
      return res.status(500).json({ error: "Failed to log out." });
    }

    req.session.destroy((sessionError) => {
      if (sessionError) {
        console.error("Error destroying session:", sessionError);
        return res.status(500).json({ error: "Failed to clear session." });
      }

      res.clearCookie("connect.sid");
      return res.status(200).json({ message: "Logged out successfully." });
    });
  });
});

router.get("/me", (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(200).json({ user: null });
  }

  return res.status(200).json({ user: safeUser(req.user) });
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
