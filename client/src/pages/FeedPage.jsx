import { useEffect, useState } from "react";
import axios from "axios";
import EntryModal from "../components/EntryModal";

export default function FeedPage() {
  const [entries, setEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [companyFilter, setCompanyFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/entries");
        setEntries(response.data);
      } catch (error) {
        console.error("Error fetching entries:", error);
      }
    };

    fetchEntries();
  }, []);

  const uniqueCompanies = [...new Set(entries.map((entry) => entry.company_name))];

  const filteredAndSortedEntries = [...entries]
    .filter((entry) => {
      const matchesCompany =
        companyFilter === "" || entry.company_name === companyFilter;

      const matchesJobType =
        jobTypeFilter === "" || entry.job_type === jobTypeFilter;

      return matchesCompany && matchesJobType;
    })
    .sort((a, b) => {
      const dateA = new Date(a.layoff_date);
      const dateB = new Date(b.layoff_date);

      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

  return (
    <div style={{ marginTop: "2rem" }}>
      <h1>Feed Page</h1>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginBottom: "1.5rem",
          alignItems: "center",
        }}
      >
        <select
          value={companyFilter}
          onChange={(e) => setCompanyFilter(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="">All Companies</option>
          {uniqueCompanies.map((company) => (
            <option key={company} value={company}>
              {company}
            </option>
          ))}
        </select>

        <select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Contract">Contract</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
        </select>

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          style={{ padding: "0.5rem", borderRadius: "6px" }}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {filteredAndSortedEntries.length === 0 ? (
        <p>No matching entries found.</p>
      ) : (
        filteredAndSortedEntries.map((entry) => (
          <div
            key={entry.id}
            onClick={() => setSelectedEntry(entry)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "1rem",
              marginBottom: "1rem",
              cursor: "pointer",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <h3>
              {entry.role} @ {entry.company_name}
            </h3>

            <p>{entry.summary}</p>

            <small>
              {entry.location} • {entry.job_type} • Laid off:{" "}
              {new Date(entry.layoff_date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </small>

            <p
              style={{
                marginTop: "0.75rem",
                color: "#2563eb",
                fontSize: "0.9rem",
                fontWeight: 500,
              }}
            >
              Click to view full details
            </p>
          </div>
        ))
      )}

      <EntryModal
        entry={selectedEntry}
        onClose={() => setSelectedEntry(null)}
      />
    </div>
  );
}