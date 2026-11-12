import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area,
} from 'recharts';

import Spinner from '../components/Spinner';
import './StatsPage.css';

/* ------------------ CONFIG ------------------ */

const API_URL = '/api/stats';

const COLORS = ['#60a5fa', '#34d399', '#fbbf24', '#f472b6', '#a78bfa'];

/* ------------------ MAIN PAGE ------------------ */

export default function StatsPage() {
  const { data, loading, error } = useStats();

  if (loading) return <Spinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="stats-page">
      <h2 className="stats-title">LayoffLens Stats</h2>

      <SummaryCards summary={data.summary} />

      <TopCompaniesChart data={data.top_companies} />
      <MonthlyTrendChart data={data.monthly_trend} />

      <div className="stats-row">
        <JobTypePie data={data.by_job_type} />
        <IndustryBar data={data.by_industry} />
      </div>
    </div>
  );
}

/* ------------------ DATA FETCHING ------------------ */

// Custom hook = cleaner than useEffect inline
function useStats() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get(API_URL);
        setData(res.data);
      } catch (err) {
        setError('Failed to load stats.');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  return { data, loading, error };
}

/* ------------------ SUMMARY ------------------ */

function SummaryCards({ summary }) {
  const total = summary.total_user_entries + summary.total_external_entries;

  return (
    <div className="stats-cards">
      <StatCard
        label="Total Entries"
        value={total}
        sub={`${summary.total_user_entries} community · ${summary.total_external_entries} news`}
      />
      <StatCard
        label="Avg Severance"
        value={formatWeeks(summary.avg_severance_weeks)}
      />
      <StatCard
        label="Avg Job Search"
        value={formatWeeks(summary.avg_job_search_weeks)}
      />
    </div>
  );
}

function StatCard({ label, value, sub }) {
  return (
    <div className="stat-card">
      <strong>{label}</strong>
      <div>{value}</div>
      {sub && <small>{sub}</small>}
    </div>
  );
}

/* ------------------ CHARTS ------------------ */

function TopCompaniesChart({ data }) {
  if (!data.length) return <Empty title="Top Companies" />;

  return (
    <ChartSection title="Top Companies">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          {/* <CartesianGrid vertical={false} /> */}
          <XAxis dataKey="company_name" />
          <YAxis allowDecimals={false} />
          <Tooltip cursor={false} />
          <Bar dataKey="entry_count">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

function MonthlyTrendChart({ data }) {
  if (!data.length) return <Empty title="Monthly Trend" />;

  return (
    <ChartSection title="Layoffs Over Time">
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid horizontal={false} vertical={false} />
          <XAxis dataKey="month" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="count" stroke="#34d399" />
          {/* <Area
            type="monotone"
            dataKey="count"
            stroke="#34d399"
            fill="#34d399"
            fillOpacity={0.2}
            
          /> */}
        </AreaChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

function JobTypePie({ data }) {
  if (!data.length) return <Empty title="Job Types" />;

  return (
    <ChartSection title="Job Types">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={data} dataKey="count" nameKey="job_type">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

function IndustryBar({ data }) {
  if (!data.length) return <Empty title="Industries" />;

  return (
    <ChartSection title="Layoffs by Industry">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          {/* <CartesianGrid vertical={false} /> */}
          <XAxis dataKey="industry" />
          <YAxis allowDecimals={false} />
          <Tooltip cursor={false} />
          <Bar dataKey="count" fill="#a78bfa">
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartSection>
  );
}

/* ------------------ HELPERS ------------------ */

function formatWeeks(value) {
  return value ? `${value} weeks` : 'N/A';
}

function ChartSection({ title, children }) {
  return (
    <section className="stats-section">
      <h3>{title}</h3>
      {children}
    </section>
  );
}

function Empty({ title }) {
  return (
    <section className="stats-section">
      <h3>{title}</h3>
      <p>No data yet.</p>
    </section>
  );
}

function ErrorMessage({ message }) {
  return <p style={{ color: 'red' }}>{message}</p>;
}
