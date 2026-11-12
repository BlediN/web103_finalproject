import pool from "../config/database.js";
import crypto from "crypto";
import { execFile } from "child_process";
import { promisify } from "util";

const execFileAsync = promisify(execFile);
const GDELT_TIMEOUT_SECONDS = Number(process.env.GDELT_TIMEOUT_SECONDS || 60);
const GDELT_RETRY_ATTEMPTS = Number(process.env.GDELT_RETRY_ATTEMPTS || 2);

const GDELT_QUERY = `(layoff OR layoffs OR \"job cuts\" OR \"workforce reduction\")`;

function buildGdeltUrl() {
  const params = new URLSearchParams({
    query: GDELT_QUERY,
    mode: "ArtList",
    format: "json",
    maxrecords: "25",
    sort: "HybridRel",
  });

  return `https://api.gdeltproject.org/api/v2/doc/doc?${params.toString()}`;
}

function buildExternalId(url) {
  return crypto.createHash("sha256").update(url).digest("hex");
}

async function fetchJsonWithCurl(url) {
  const curlBinary = process.platform === "win32" ? "curl.exe" : "curl";
  const { stdout } = await execFileAsync(curlBinary, [
    "--silent",
    "--show-error",
    "--location",
    "--max-time",
    String(GDELT_TIMEOUT_SECONDS),
    url,
  ]);

  return JSON.parse(stdout || "{}");
}

async function fetchJsonWithNodeFetch(url) {
  const controller = new AbortController();
  const timeoutId = setTimeout(
    () => controller.abort(),
    GDELT_TIMEOUT_SECONDS * 1000
  );

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`GDELT responded with status ${response.status}`);
    }

    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

async function fetchGdeltPayload(url) {
  try {
    return await fetchJsonWithCurl(url);
  } catch (curlError) {
    try {
      return await fetchJsonWithNodeFetch(url);
    } catch (fetchError) {
      const timeoutMessage =
        curlError?.code === 28 || fetchError?.name === "AbortError"
          ? `GDELT request timed out after ${GDELT_TIMEOUT_SECONDS} seconds.`
          : "GDELT request failed.";

      const error = new Error(timeoutMessage);
      error.cause = {
        curlError: curlError?.message || String(curlError),
        fetchError: fetchError?.message || String(fetchError),
      };
      throw error;
    }
  }
}

async function fetchGdeltPayloadWithRetry(url) {
  let lastError;

  for (let attempt = 1; attempt <= GDELT_RETRY_ATTEMPTS; attempt += 1) {
    try {
      return await fetchGdeltPayload(url);
    } catch (error) {
      lastError = error;

      if (attempt < GDELT_RETRY_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
      }
    }
  }

  throw lastError;
}

function inferCompanyName(article) {
  const rawTitle = article?.title || "";
  const separators = [" lays off", " cuts", " to lay off", " announces", " amid"];

  for (const separator of separators) {
    const index = rawTitle.toLowerCase().indexOf(separator);
    if (index > 0) {
      return rawTitle.slice(0, index).trim();
    }
  }

  return article?.domain?.trim() || article?.source?.name?.trim() || "Unknown Company";
}

function parseExternalDate(rawDate) {
  if (!rawDate) {
    return new Date();
  }

  if (typeof rawDate === "string" && /^\d{14}$/.test(rawDate)) {
    const year = rawDate.slice(0, 4);
    const month = rawDate.slice(4, 6);
    const day = rawDate.slice(6, 8);
    const hour = rawDate.slice(8, 10);
    const minute = rawDate.slice(10, 12);
    const second = rawDate.slice(12, 14);
    return new Date(`${year}-${month}-${day}T${hour}:${minute}:${second}Z`);
  }

  const parsed = new Date(rawDate);
  return parsed;
}

function formatExternalArticle(article) {
  const sourceUrl = article?.url?.trim();

  if (!sourceUrl) {
    return null;
  }

  const publishedDate = parseExternalDate(
    article?.seendate || article?.datetime || article?.publishedAt
  );

  const layoffDate = Number.isNaN(publishedDate.getTime())
    ? new Date().toISOString().slice(0, 10)
    : publishedDate.toISOString().slice(0, 10);

  return {
    external_id: buildExternalId(sourceUrl),
    company_name: inferCompanyName(article),
    role: "Layoff Report",
    job_type: "News",
    location: article?.sourceCountry || article?.domain || "Global",
    layoff_date: layoffDate,
    summary: (
      article?.snippet || article?.description || article?.title || "No summary available."
    ).trim(),
    source_url: sourceUrl,
    source_name: article?.domain || article?.source?.name || "GDELT",
    source_type: "gdelt",
  };
}

const EntryModel = {
  async ensureExternalTable() {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS external_entries (
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
  },

  async getAll({ includeInternal = false } = {}) {
    await this.ensureExternalTable();

    const query = includeInternal
      ? `
        SELECT *
        FROM (
          SELECT
            e.id::text AS id,
            e.user_id,
            e.company_id,
            e.role,
            e.job_type,
            e.location,
            e.severance_weeks,
            e.layoff_date,
            e.job_search_weeks,
            e.is_anonymous,
            e.summary,
            e.created_at,
            e.updated_at,
            c.name AS company_name,
            u.username,
            NULL::text AS source_url,
            NULL::text AS source_name,
            'user'::text AS source_type,
            false AS is_external
          FROM entries e
          JOIN companies c ON e.company_id = c.id
          LEFT JOIN users u ON e.user_id = u.id

          UNION ALL

          SELECT
            CONCAT('ext-', ex.id)::text AS id,
            NULL::int AS user_id,
            NULL::int AS company_id,
            ex.role,
            ex.job_type,
            ex.location,
            NULL::int AS severance_weeks,
            ex.layoff_date,
            NULL::int AS job_search_weeks,
            true AS is_anonymous,
            ex.summary,
            ex.created_at,
            ex.updated_at,
            ex.company_name,
            ex.source_name AS username,
            ex.source_url,
            ex.source_name,
            ex.source_type,
            true AS is_external
          FROM external_entries ex
        ) merged_entries
        ORDER BY layoff_date DESC, created_at DESC;
      `
      : `
        SELECT
          CONCAT('ext-', ex.id)::text AS id,
          NULL::int AS user_id,
          NULL::int AS company_id,
          ex.role,
          ex.job_type,
          ex.location,
          NULL::int AS severance_weeks,
          ex.layoff_date,
          NULL::int AS job_search_weeks,
          true AS is_anonymous,
          ex.summary,
          ex.created_at,
          ex.updated_at,
          ex.company_name,
          ex.source_name AS username,
          ex.source_url,
          ex.source_name,
          ex.source_type,
          true AS is_external
        FROM external_entries ex
        ORDER BY ex.layoff_date DESC, ex.created_at DESC;
      `;

    const result = await pool.query(query);
    return result.rows;
  },

  async getOne(entryId) {
    const query = `
      SELECT
        e.id,
        e.user_id,
        e.company_id,
        e.role,
        e.job_type,
        e.location,
        e.severance_weeks,
        e.layoff_date,
        e.job_search_weeks,
        e.is_anonymous,
        e.summary,
        e.created_at,
        e.updated_at,
        c.name AS company_name,
        u.username
      FROM entries e
      JOIN companies c ON e.company_id = c.id
      LEFT JOIN users u ON e.user_id = u.id
      WHERE e.id = $1;
    `;

    const result = await pool.query(query, [entryId]);
    return result.rows[0];
  },

  async createOne(entryData) {
    const {
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
    } = entryData;

    const query = `
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
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async updateOne(entryId, entryData) {
    const {
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
    } = entryData;

    const query = `
      UPDATE entries
      SET
        user_id = $1,
        company_id = $2,
        role = $3,
        job_type = $4,
        location = $5,
        severance_weeks = $6,
        layoff_date = $7,
        job_search_weeks = $8,
        is_anonymous = $9,
        summary = $10,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *;
    `;

    const values = [
      user_id,
      company_id,
      role,
      job_type,
      location,
      severance_weeks,
      layoff_date,
      job_search_weeks,
      is_anonymous,
      summary,
      entryId,
    ];

    const result = await pool.query(query, values);
    return result.rows[0];
  },

  async deleteOne(entryId) {
    const query = `
      DELETE FROM entries
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(query, [entryId]);
    return result.rows[0];
  },

  async importNewsFeed() {
    await this.ensureExternalTable();

    const payload = await fetchGdeltPayloadWithRetry(buildGdeltUrl());
    const articles = Array.isArray(payload?.articles)
      ? payload.articles
      : Array.isArray(payload?.results)
        ? payload.results
        : [];

    const normalizedArticles = articles
      .map(formatExternalArticle)
      .filter(Boolean);

    const uniqueArticles = [...new Map(
      normalizedArticles.map((article) => [article.external_id, article])
    ).values()];

    let importedCount = 0;

    for (const article of uniqueArticles) {
      const result = await pool.query(
        `
        INSERT INTO external_entries (
          external_id,
          company_name,
          role,
          job_type,
          location,
          layoff_date,
          summary,
          source_url,
          source_name,
          source_type
        )
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
        ON CONFLICT (external_id)
        DO NOTHING
        RETURNING id;
        `,
        [
          article.external_id,
          article.company_name,
          article.role,
          article.job_type,
          article.location,
          article.layoff_date,
          article.summary,
          article.source_url,
          article.source_name,
          article.source_type,
        ]
      );

      if (result.rows.length > 0) {
        importedCount += 1;
      }
    }

    return {
      importedCount,
      scannedCount: uniqueArticles.length,
    };
  },
};

export default EntryModel;