import passportLocal from "passport-local";
import crypto from "crypto";
import pool from "./database.js";

const LocalStrategy = passportLocal.Strategy;

const HASH_ITERATIONS = 100000;
const HASH_KEY_LENGTH = 64;
const HASH_DIGEST = "sha512";

const hashPassword = (password, salt) =>
  crypto
    .pbkdf2Sync(password, salt, HASH_ITERATIONS, HASH_KEY_LENGTH, HASH_DIGEST)
    .toString("hex");

const verifyPassword = (password, salt, expectedHash) => {
  if (!salt || !expectedHash) {
    return false;
  }

  const computedHash = hashPassword(password, salt);
  return computedHash === expectedHash;
};

export const safeUser = (row) => ({
  id: row.id,
  username: row.username,
  email: row.email,
  created_at: row.created_at,
});

export const ensureAuthColumns = async () => {
  await pool.query(`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS email VARCHAR,
    ADD COLUMN IF NOT EXISTS password_hash VARCHAR,
    ADD COLUMN IF NOT EXISTS password_salt VARCHAR;
  `);
};

export function configurePassport(passport) {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        await ensureAuthColumns();

        const normalizedUsername = String(username || "").trim();
        if (!normalizedUsername || !password) {
          return done(null, false, { message: "Invalid username or password." });
        }

        const result = await pool.query(
          `SELECT id, username, email, password_hash, password_salt, created_at
           FROM users
           WHERE LOWER(username) = LOWER($1)
           LIMIT 1`,
          [normalizedUsername]
        );

        if (result.rows.length === 0) {
          return done(null, false, { message: "Invalid username or password." });
        }

        const user = result.rows[0];
        const isValid = verifyPassword(password, user.password_salt, user.password_hash);

        if (!isValid) {
          return done(null, false, { message: "Invalid username or password." });
        }

        return done(null, safeUser(user));
      } catch (error) {
        return done(error);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const result = await pool.query(
        `SELECT id, username, email, created_at
         FROM users
         WHERE id = $1
         LIMIT 1`,
        [id]
      );

      if (result.rows.length === 0) {
        return done(null, false);
      }

      return done(null, safeUser(result.rows[0]));
    } catch (error) {
      return done(error);
    }
  });
}

export { hashPassword };