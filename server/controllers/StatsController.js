import StatsModel from '../models/StatsModel.js';

// Simple function instead of a class
export const getStats = async (req, res) => {
  try {
    // Fetch all data at the same time
    const results = await Promise.all([
      StatsModel.getSummary(),
      StatsModel.getExternalCount(),
      StatsModel.getTopCompanies(),
      StatsModel.getByJobType(),
      StatsModel.getByIndustry(),
      StatsModel.getMonthlyTrend(),
    ]);

    // Destructure results for clarity
    const [
      summary,
      externalCount,
      topCompanies,
      byJobType,
      byIndustry,
      monthlyTrend,
    ] = results;

    // Build response step by step (easier to read)
    const response = {
      summary: {
        total_user_entries: Number(summary.total_user_entries),
        total_external_entries: Number(externalCount.total_external_entries),
        avg_severance_weeks: summary.avg_severance_weeks
          ? Number(summary.avg_severance_weeks)
          : null,
        avg_job_search_weeks: summary.avg_job_search_weeks
          ? Number(summary.avg_job_search_weeks)
          : null,
      },

      top_companies: topCompanies.map((item) => ({
        company_name: item.company_name,
        entry_count: Number(item.entry_count),
      })),

      by_job_type: byJobType.map((item) => ({
        job_type: item.job_type,
        count: Number(item.count),
      })),

      by_industry: byIndustry.map((item) => ({
        industry: item.industry,
        count: Number(item.count),
      })),

      monthly_trend: monthlyTrend.map((item) => ({
        month: item.month,
        count: Number(item.count),
      })),
    };

    // Send response
    res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching stats:', error);

    res.status(500).json({
      error: 'Failed to fetch stats.',
    });
  }
};
