import pool from "../config/database.js";

const StatsModel = {
  async getSummary() {
    const result = await pool.query(`
      SELECT
        COUNT(*) AS total_user_entries,
        ROUND(AVG(severance_weeks) FILTER (WHERE severance_weeks IS NOT NULL), 1) AS avg_severance_weeks,
        ROUND(AVG(job_search_weeks) FILTER (WHERE job_search_weeks IS NOT NULL), 1) AS avg_job_search_weeks
      FROM entries;
    `);
    return result.rows[0];
  },

  async getExternalCount() {
    const result = await pool.query(`
      SELECT COUNT(*) AS total_external_entries
      FROM external_entries;
    `);
    return result.rows[0];
  },

  async getTopCompanies(limit = 10) {
    const result = await pool.query(
      `
      SELECT c.name AS company_name, COUNT(*) AS entry_count
      FROM entries e
      JOIN companies c ON e.company_id = c.id
      GROUP BY c.name
      ORDER BY entry_count DESC
      LIMIT $1;
    `,
      [limit]
    );
    return result.rows;
  },

  async getByJobType() {
    const result = await pool.query(`
      SELECT job_type, COUNT(*) AS count
      FROM entries
      GROUP BY job_type
      ORDER BY count DESC;
    `);
    return result.rows;
  },

  async getByIndustry() {
    const result = await pool.query(`
      SELECT COALESCE(i.name, 'Unknown') AS industry, COUNT(*) AS count
      FROM entries e
      JOIN companies c ON e.company_id = c.id
      LEFT JOIN industries i ON c.industry_id = i.id
      GROUP BY i.name
      ORDER BY count DESC;
    `);
    return result.rows;
  },

  async getMonthlyTrend() {
    const result = await pool.query(`
      SELECT
        TO_CHAR(DATE_TRUNC('month', layoff_date), 'YYYY-MM') AS month,
        COUNT(*) AS count
      FROM entries
      WHERE layoff_date >= NOW() - INTERVAL '12 months'
      GROUP BY month
      ORDER BY month ASC;
    `);
    return result.rows;
  },
};

export default StatsModel;
