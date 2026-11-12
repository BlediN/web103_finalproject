import pool from "./database.js";

export async function runReset() {
  await pool.query("BEGIN");

  try {
    await pool.query(`
      DROP TABLE IF EXISTS entry_tags CASCADE;
      DROP TABLE IF EXISTS tags CASCADE;
      DROP TABLE IF EXISTS user_profiles CASCADE;
      DROP TABLE IF EXISTS entries CASCADE;
      DROP TABLE IF EXISTS external_entries CASCADE;
      DROP TABLE IF EXISTS companies CASCADE;
      DROP TABLE IF EXISTS industries CASCADE;
      DROP TABLE IF EXISTS users CASCADE;

      CREATE TABLE users (
        id SERIAL PRIMARY KEY,
        github_id VARCHAR NOT NULL,
        username VARCHAR NOT NULL UNIQUE,
        email VARCHAR,
        password_hash VARCHAR,
        password_salt VARCHAR,
        avatar_url VARCHAR,
        is_admin BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      );

      CREATE TABLE user_profiles (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        bio VARCHAR,
        location VARCHAR,
        company_name VARCHAR,
        job_title VARCHAR,
        website VARCHAR,
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

      CREATE TABLE tags (
        id SERIAL PRIMARY KEY,
        name VARCHAR NOT NULL UNIQUE,
        description VARCHAR,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
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

      CREATE TABLE entry_tags (
        id SERIAL PRIMARY KEY,
        entry_id INT NOT NULL REFERENCES entries(id) ON DELETE CASCADE,
        tag_id INT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(entry_id, tag_id)
      );

      CREATE TABLE external_entries (
        id SERIAL PRIMARY KEY,
        external_id VARCHAR NOT NULL UNIQUE,
        company_name VARCHAR NOT NULL,
        role VARCHAR NOT NULL DEFAULT 'Layoff Report',
        job_type VARCHAR NOT NULL DEFAULT 'News',
        location VARCHAR,
        layoff_date DATE NOT NULL,
        summary TEXT NOT NULL,
        source_url TEXT NOT NULL,
        source_name VARCHAR,
        source_type VARCHAR NOT NULL DEFAULT 'gdelt',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP
      );
    `);

    await pool.query(`
      INSERT INTO users (github_id, username, email, password_hash, password_salt, avatar_url, is_admin)
      VALUES
        ('github_anthonyc247', 'anthonyc247', 'anthony@example.com', NULL, NULL, NULL, true),
        ('github_abirmahmood6', 'abirmahmood6', 'abir@example.com', NULL, NULL, NULL, false);
    `);

    await pool.query(`
      INSERT INTO industries (name)
      VALUES
        ('Tech'),
        ('Finance'),
        ('Healthcare');
    `);

    await pool.query(`
      INSERT INTO companies (name, website, industry_id)
      VALUES
        ('Meta', 'https://meta.com', 1),
        ('Google', 'https://google.com', 1),
        ('Stripe', 'https://stripe.com', 2);
    `);

    await pool.query(`
      INSERT INTO entries (
        user_id,
        company_id,
        role,
        job_type,
        location,
        severance_weeks,
        layoff_date,
        job_search_weeks,
        is_anonymous,
        summary
      )
      VALUES
        (
          1,
          1,
          'Software Engineer',
          'Full-time',
          'Menlo Park, CA',
          12,
          '2026-02-15',
          8,
          false,
          'Layoff was unexpected but severance helped during the transition.'
        ),
        (
          2,
          2,
          'Product Designer',
          'Full-time',
          'Remote',
          10,
          '2026-01-20',
          6,
          true,
          'Team was reduced during restructuring.'
        ),
        (
          1,
          3,
          'Backend Engineer',
          'Contract',
          'New York, NY',
          8,
          '2026-02-01',
          7,
          false,
          'Unexpected layoff after project cancellation.'
        );
    `);

    await pool.query(`
      INSERT INTO user_profiles (user_id, bio, location, company_name, job_title, website)
      VALUES
        (1, 'Full-stack engineer passionate about startups', 'San Francisco, CA', 'Tech Startups', 'Senior Engineer', 'https://anthonyc247.dev'),
        (2, 'Product designer with UX expertise', 'New York, NY', 'Design Studios', 'Lead Designer', NULL);
    `);

    await pool.query(`
      INSERT INTO tags (name, description)
      VALUES
        ('Tech', 'Technology industry layoffs'),
        ('Remote', 'Remote work related'),
        ('Restructuring', 'Company restructuring'),
        ('Severance', 'Generous severance packages');
    `);

    await pool.query(`
      INSERT INTO entry_tags (entry_id, tag_id)
      VALUES
        (1, 1),
        (1, 4),
        (2, 1),
        (2, 2),
        (2, 3),
        (3, 1),
        (3, 3);
    `);

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
}
