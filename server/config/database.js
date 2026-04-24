import "./dotenv.js";
import pg from "pg";

const { Pool } = pg;

const useSsl =
  process.env.PGSSLMODE === "require" || process.env.NODE_ENV === "production";

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    })
  : new Pool({
      user: process.env.PGUSER,
      host: process.env.PGHOST,
      database: process.env.PGDATABASE,
      password: process.env.PGPASSWORD,
      port: Number(process.env.PGPORT),
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    });

console.log("DB NAME FROM ENV:", process.env.PGDATABASE);
export default pool;