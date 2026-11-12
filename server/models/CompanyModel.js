import pool from "../config/database.js";

const CompanyModel = {
  async getAll() {
    const result = await pool.query(`
      SELECT id, name, website, industry_id
      FROM companies
      ORDER BY name ASC
    `);

    return result.rows;
  },

  async getOne(id) {
    const result = await pool.query(
      `
      SELECT id, name, website, industry_id
      FROM companies
      WHERE id = $1
      `,
      [id]
    );

    return result.rows[0];
  },

  async findByName(name) {
    const result = await pool.query(
      `
      SELECT id, name, website, industry_id
      FROM companies
      WHERE LOWER(name) = LOWER($1)
      LIMIT 1
      `,
      [name]
    );

    return result.rows[0] || null;
  },

  async createOne({ name, website = null, industry_id = null }) {
    const result = await pool.query(
      `
      INSERT INTO companies (name, website, industry_id)
      VALUES ($1, $2, $3)
      RETURNING id, name, website, industry_id
      `,
      [name, website, industry_id]
    );

    return result.rows[0];
  },
};

export default CompanyModel;
