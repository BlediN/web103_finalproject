import pool from "./database.js";

const resetDatabase = async () => {
  const query = `
    DROP TABLE IF EXISTS entries CASCADE;
    DROP TABLE IF EXISTS companies CASCADE;
    DROP TABLE IF EXISTS industries CASCADE;
    DROP TABLE IF EXISTS users CASCADE;

    CREATE TABLE users (
      id SERIAL PRIMARY KEY,
      github_id VARCHAR NOT NULL,
      username VARCHAR NOT NULL,
      avatar_url VARCHAR,
      is_admin BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );

    CREATE TABLE industries (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE
    );

    CREATE TABLE companies (
      id SERIAL PRIMARY KEY,
      name VARCHAR NOT NULL UNIQUE,
      website VARCHAR,
      industry_id INT REFERENCES industries(id),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );

    CREATE TABLE entries (
      id SERIAL PRIMARY KEY,
      user_id INT NOT NULL REFERENCES users(id),
      company_id INT NOT NULL REFERENCES companies(id),
      role VARCHAR NOT NULL,
      job_type VARCHAR NOT NULL,
      location VARCHAR,
      severance_weeks INT NOT NULL,
      layoff_date DATE NOT NULL,
      job_search_weeks INT,
      is_anonymous BOOLEAN NOT NULL DEFAULT false,
      summary TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP
    );
  `;

  try {
    await pool.query(query);
    console.log("Database tables created successfully.");
  } catch (error) {
    console.error("Error resetting database:", error);
  } finally {
    await pool.end();
  }
};

resetDatabase();